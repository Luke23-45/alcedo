import {
  CardioExerciseBlueprint,
  ExerciseBlueprint,
  repsTargetsEqual,
  Rest,
  SessionBlueprint,
  WeightedExerciseBlueprint,
} from '@/models/blueprint-models';
import { TemporalComparer } from '@/models/comparers';
import { SessionJSON, fromLocalDateJSON, toLocalDateJSON, fromOffsetDateTimeJSON, toOffsetDateTimeJSON } from '@/models/storage/versions/latest';
import { Weight, WeightUnit } from '@/models/weight';
import { indexed } from '@/utils/enumerable';
import { Duration, LocalDate, OffsetDateTime } from '@js-joda/core';
import { match } from 'ts-pattern';
import Enumerable from 'linq';
import { P } from 'ts-pattern';
import { uuid } from '@/utils/uuid';
import { equal } from '@/models/session-models/helpers';
import { RecordedCardioExercise, RecordedCardioExerciseSet } from '@/models/session-models/recorded-cardio-exercise';
import {
  RecordedExercise,
  createEmptyRecordedExercise,
  fromRecordedExerciseJSON,
} from '@/models/session-models/recorded-exercise';
import { PotentialSet, RecordedWeightedExercise } from '@/models/session-models/recorded-weighted-exercise';
import { RestTimer } from '@/models/session-models/rest-timer';
import { IndexOutOfBoundsError } from '@/utils/index-out-of-bounds';

export class Session {
  constructor(
    readonly id: string,
    readonly blueprint: SessionBlueprint,
    readonly recordedExercises: RecordedExercise[],
    readonly date: LocalDate,
    readonly bodyweight: Weight | undefined,
    readonly restTimer: RestTimer | undefined,
    readonly startedAt?: OffsetDateTime | undefined,
    readonly pausedAt?: OffsetDateTime | undefined,
    readonly pausedTotalMs?: number | undefined,
  ) {}

  get workoutPhase(): 'idle' | 'running' | 'paused' {
    if (!this.startedAt) return 'idle';
    if (this.pausedAt) return 'paused';
    return 'running';
  }

  elapsedMsAt(now: OffsetDateTime): number {
    if (!this.startedAt) {
      return 0;
    }
    const totalPassed = Duration.between(this.startedAt, now).toMillis();
    const currentPause = this.pausedAt ? Duration.between(this.pausedAt, now).toMillis() : 0;
    return Math.max(0, totalPassed - (this.pausedTotalMs ?? 0) - currentPause);
  }

  withStartedAt(now: OffsetDateTime): Session {
    if (this.startedAt) return this;
    return this.with({ startedAt: now, pausedAt: undefined, pausedTotalMs: 0 });
  }

  withPaused(now: OffsetDateTime): Session {
    if (!this.startedAt || this.pausedAt) return this;
    return this.with({ pausedAt: now });
  }

  withResumed(now: OffsetDateTime): Session {
    if (!this.startedAt || !this.pausedAt) return this;
    const pauseDurationMs = Duration.between(this.pausedAt, now).toMillis();
    return this.with({
      pausedAt: undefined,
      pausedTotalMs: (this.pausedTotalMs ?? 0) + Math.max(0, pauseDurationMs),
    });
  }

  get duration(): Duration | undefined {
    // When startedAt is set, duration is derived from the persisted workout clock.
    // If startedAt is absent (legacy sessions persisted prior to v9), fall back to
    // Duration.between(firstExercise.earliestTime, lastExercise.latestTime) so historical
    // logs remain valid and byte-identical.
    if (this.startedAt) {
      const end = this.pausedAt ?? this.lastExercise?.latestTime ?? OffsetDateTime.now();
      return Duration.ofMillis(this.elapsedMsAt(end));
    }
    return this.lastExercise?.latestTime && this.firstExercise?.earliestTime
      ? Duration.between(this.firstExercise.earliestTime, this.lastExercise.latestTime)
      : undefined;
  }

  static fromJSON(json: SessionJSON): Session {
    return new Session(
      json.id,
      SessionBlueprint.fromJSON({
        ...json.blueprint,
        version: 7,
        exercises: json.recordedExercises.map((x) => x.blueprint),
      }),
      json.recordedExercises.map(fromRecordedExerciseJSON),
      fromLocalDateJSON(json.date),
      json.bodyweight ? Weight.fromJSON(json.bodyweight) : undefined,
      undefined,
      json.startedAt ? fromOffsetDateTimeJSON(json.startedAt) : undefined,
      json.pausedAt ? fromOffsetDateTimeJSON(json.pausedAt) : undefined,
      json.pausedTotalMs,
    );
  }

  static getEmptySession(blueprint: SessionBlueprint, defaultWeightUnit: WeightUnit): Session {
    function getNextExercise(e: ExerciseBlueprint) {
      return match(e)
        .with(
          P.instanceOf(WeightedExerciseBlueprint),
          (we) =>
            new RecordedWeightedExercise(
              we,
              we.plannedSets.map((s) => new PotentialSet(undefined, new Weight(0, defaultWeightUnit), s.reps)),
              undefined,
            ),
        )
        .with(P.instanceOf(CardioExerciseBlueprint), (ce) => RecordedCardioExercise.empty(ce))
        .exhaustive();
    }
    return new Session(
      uuid(),
      blueprint,
      blueprint.exercises.map(getNextExercise),
      LocalDate.now(),
      undefined,
      undefined,
    );
  }

  withNoNilWeights(fallbackWeightUnit: WeightUnit): Session | undefined {
    return this.with({
      recordedExercises: this.recordedExercises.map((re) =>
        re instanceof RecordedWeightedExercise
          ? re.with({
              potentialSets: re.potentialSets.map((ps) =>
                ps.with({
                  weight: ps.weight.with({
                    unit: ps.weight.unit === 'nil' ? fallbackWeightUnit : ps.weight.unit,
                  }),
                }),
              ),
            })
          : re,
      ),
    });
  }

  equals(other: Session | undefined): boolean {
    if (!other) {
      return false;
    }

    const sameStartedAt =
      (!this.startedAt && !other.startedAt) ||
      (!!this.startedAt && !!other.startedAt && this.startedAt.isEqual(other.startedAt));
    const samePausedAt =
      (!this.pausedAt && !other.pausedAt) ||
      (!!this.pausedAt && !!other.pausedAt && this.pausedAt.isEqual(other.pausedAt));
    const samePausedTotalMs = this.pausedTotalMs === other.pausedTotalMs;

    return (
      this.id === other.id &&
      this.date.equals(other.date) &&
      equal(this.bodyweight, other.bodyweight) &&
      this.blueprint.equals(other.blueprint) &&
      sameStartedAt &&
      samePausedAt &&
      samePausedTotalMs &&
      this.recordedExercises.length === other.recordedExercises.length &&
      this.recordedExercises.every((exercise, index) => exercise.equals(other.recordedExercises[index]))
    );
  }

  with(other: Partial<Session>) {
    return new Session(
      'id' in other ? (other.id ?? this.id) : this.id,
      'blueprint' in other ? (other.blueprint ?? this.blueprint) : this.blueprint,
      'recordedExercises' in other ? (other.recordedExercises ?? this.recordedExercises) : this.recordedExercises,
      'date' in other ? (other.date ?? this.date) : this.date,
      'bodyweight' in other ? other.bodyweight : this.bodyweight,
      'restTimer' in other ? other.restTimer : this.restTimer,
      'startedAt' in other ? other.startedAt : this.startedAt,
      'pausedAt' in other ? other.pausedAt : this.pausedAt,
      'pausedTotalMs' in other ? other.pausedTotalMs : this.pausedTotalMs,
    );
  }

  withEditedExercise(exerciseIndex: number, newBlueprint: ExerciseBlueprint, useImperialUnits: boolean): Session {
    // oxlint-disable-next-line typescript/no-this-alias
    let session: Session = this;
    const existingExercise = session.recordedExercises[exerciseIndex];
    if (!existingExercise) {
      throw new IndexOutOfBoundsError(exerciseIndex, session.recordedExercises);
    }

    session = session.with({
      blueprint: session.blueprint.with({
        exercises: session.blueprint.exercises.with(exerciseIndex, newBlueprint),
      }),
    });
    if (existingExercise.blueprint.type !== newBlueprint.type) {
      session = session.withExercise(
        exerciseIndex,
        createEmptyRecordedExercise(newBlueprint, useImperialUnits ? 'pounds' : 'kilograms'),
      );
    } else {
      const weightedExistingExercise =
        session.recordedExercises[exerciseIndex]!.type === 'RecordedWeightedExercise'
          ? session.recordedExercises[exerciseIndex]
          : undefined;
      if (weightedExistingExercise) {
        session = session.withExercise(
          exerciseIndex,
          weightedExistingExercise.with({
            blueprint: newBlueprint as WeightedExerciseBlueprint,
            // A set you already logged was chasing the target it was chasing, so only unrecorded
            // sets take the edited blueprint's targets - and only where the edit actually moved
            // them. A carried target can sit above what the plan asks for, and changing the notes
            // is not a request to hand that back.
            potentialSets: (newBlueprint as WeightedExerciseBlueprint).plannedSets.map((planned, index) => {
              const existing = weightedExistingExercise.potentialSets.at(index);
              if (!existing) {
                return new PotentialSet(undefined, weightedExistingExercise.maxWeight, planned.reps);
              }
              const plannedBefore = weightedExistingExercise.blueprint.repsTargetForSet(index);
              if (existing.set || repsTargetsEqual(planned.reps, plannedBefore)) {
                return existing;
              }
              return existing.with({ target: planned.reps });
            }),
          }),
        );
      }

      const cardioExistingExercise =
        session.recordedExercises[exerciseIndex]!.type === 'RecordedCardioExercise'
          ? session.recordedExercises[exerciseIndex]
          : undefined;

      if (cardioExistingExercise) {
        session = session.withExercise(
          exerciseIndex,
          cardioExistingExercise.with({
            blueprint: newBlueprint as CardioExerciseBlueprint,
            sets: (newBlueprint as CardioExerciseBlueprint).sets.map((set, i) =>
              RecordedCardioExerciseSet.empty(set).with({
                // Basically allows us to use values from set, even if there are more sets now and it would be undefined
                // oxlint-disable-next-line typescript/no-misused-spread
                ...cardioExistingExercise.sets[i],
                blueprint: set,
              }),
            ),
          }),
        );
      }
    }
    return session;
  }

  withAddedExercise(exercise: ExerciseBlueprint, useImperialUnits: boolean): Session {
    return this.with({
      blueprint: this.blueprint.with({
        exercises: this.blueprint.exercises.concat(exercise),
      }),
      recordedExercises: this.recordedExercises.concat(
        createEmptyRecordedExercise(exercise, useImperialUnits ? 'pounds' : 'kilograms'),
      ),
    });
  }

  withUpdatedDate(date: LocalDate): Session {
    const originalDate = this.date;
    const newDate = date;

    // Gather all unique, non-null completion dates from all sets
    const allCompletionDates = this.recordedExercises
      .flatMap((re) =>
        re.type === 'RecordedWeightedExercise'
          ? re.potentialSets.map((ps) => ps.set?.completionDateTime?.toLocalDate())
          : re.sets.map((s) => s.completionDateTime?.toLocalDate()),
      )
      .filter((d): d is LocalDate => d !== undefined);

    // If all sets have the same completion date, use absolute date
    const useAbsoluteDate =
      allCompletionDates.length > 0 && new Set(allCompletionDates.map((d) => d.toString())).size === 1;

    function getAdjustedDate(setDate: LocalDate): LocalDate {
      if (useAbsoluteDate) {
        return newDate;
      }
      // Maintain relative offset if sets cross midnight
      const dayOffset = setDate.toEpochDay() - originalDate.toEpochDay();
      return newDate.plusDays(dayOffset);
    }

    // Update all sets' completionDateTime
    const newExercises = this.recordedExercises.map((re) => {
      if (re.type === 'RecordedWeightedExercise') {
        return re.withAllSets((ps) => {
          if (ps.set && ps.set.completionDateTime) {
            const setDate = ps.set.completionDateTime.toLocalDate();
            return ps.with({
              set: ps.set.with({
                completionDateTime: ps.set.completionDateTime
                  .toLocalTime()
                  .atDate(getAdjustedDate(setDate))
                  .atOffset(ps.set.completionDateTime.offset()),
              }),
            });
          }
          return ps;
        });
      } else {
        return re.withAllSets((set) => {
          if (set && set.completionDateTime) {
            const setDate = set.completionDateTime.toLocalDate();
            return set.with({
              completionDateTime: set.completionDateTime
                .toLocalTime()
                .atDate(getAdjustedDate(setDate))
                .atOffset(set.completionDateTime.offset()),
            });
          }
          return set;
        });
      }
    });

    return this.with({
      recordedExercises: newExercises,
      date,
    });
  }

  withNothingCompleted(): Session {
    return this.with({
      recordedExercises: this.recordedExercises.map((re) => re.withNothingCompleted()),
    });
  }

  // TODO we should update the rest timer time when we call this
  withCycledExerciseReps(exerciseIndex: number, setIndex: number, time: OffsetDateTime): Session {
    const weightedRecorded = this.recordedExercises[exerciseIndex];
    if (!weightedRecorded) {
      throw new IndexOutOfBoundsError(exerciseIndex, this.recordedExercises);
    }
    if (weightedRecorded.type !== 'RecordedWeightedExercise') {
      return this;
    }
    let newDate = this.date;
    if (!this.isStarted) {
      newDate = time.toLocalDate();
    }
    return this.with({
      date: newDate,
      recordedExercises: this.recordedExercises.with(
        exerciseIndex,
        weightedRecorded.withCycledRepCount(setIndex, time),
      ),
    });
  }

  withExercise(exerciseIndex: number, exercise: RecordedExercise): Session {
    return this.with({
      recordedExercises: this.recordedExercises.with(exerciseIndex, exercise),
      blueprint: this.blueprint.with({
        exercises: this.blueprint.exercises.with(exerciseIndex, exercise.blueprint),
      }),
    });
  }

  withRemovedExercise(exerciseIndex: number): Session {
    return this.with({
      recordedExercises: this.recordedExercises.toSpliced(exerciseIndex, 1),
      blueprint: this.blueprint.with({
        exercises: this.blueprint.exercises.toSpliced(exerciseIndex, 1),
      }),
    });
  }

  toJSON(): SessionJSON {
    return {
      version: 9,
      blueprint: this.blueprint.toJSON(),
      bodyweight: this.bodyweight?.toJSON(),
      date: toLocalDateJSON(this.date),
      id: this.id,
      recordedExercises: this.recordedExercises.map((x) => x.toJSON()),
      startedAt: this.startedAt ? toOffsetDateTimeJSON(this.startedAt) : undefined,
      pausedAt: this.pausedAt ? toOffsetDateTimeJSON(this.pausedAt) : undefined,
      pausedTotalMs: this.pausedTotalMs,
    };
  }

  static freeformSession(date: LocalDate, bodyweight: Weight | undefined): Session {
    return EmptySession.with({
      id: uuid(),
      date: date,
      bodyweight,
      blueprint: EmptySession.blueprint.with({ name: 'Freeform Workout' }),
    });
  }

  withName(name: string): Session {
    return this.with({ blueprint: this.blueprint.with({ name }) });
  }

  get totalWeightLifted(): Weight {
    return this.recordedExercises.reduce(
      (b, ex) =>
        b.plus(ex instanceof RecordedWeightedExercise ? ex.totalWeightLiftedWith(this.bodyweight) : Weight.NIL),
      Weight.NIL,
    );
  }

  get isComplete() {
    return this.recordedExercises.every((x) => x.isComplete);
  }

  get isStarted(): boolean {
    return this.recordedExercises.some((x) => x.isStarted);
  }

  get runningCardioSet():
    | { exerciseIndex: number; setIndex: number; exercise: RecordedCardioExercise; set: RecordedCardioExerciseSet }
    | undefined {
    for (const [exerciseIndex, exercise] of this.recordedExercises.entries()) {
      if (!(exercise instanceof RecordedCardioExercise)) {
        continue;
      }
      const setIndex = exercise.sets.findIndex((set) => set.isTimerRunning);
      const set = exercise.sets[setIndex];
      if (set) {
        return { exerciseIndex, setIndex, exercise, set };
      }
    }
    return undefined;
  }

  cardioSetAt(exerciseIndex: number, setIndex: number): RecordedCardioExerciseSet | undefined {
    const exercise = this.recordedExercises[exerciseIndex];
    return exercise instanceof RecordedCardioExercise ? exercise.sets[setIndex] : undefined;
  }

  withCardioSet(
    exerciseIndex: number,
    setIndex: number,
    update: (set: RecordedCardioExerciseSet) => RecordedCardioExerciseSet,
    now: OffsetDateTime,
  ): Session {
    const exercise = this.recordedExercises[exerciseIndex];
    if (!(exercise instanceof RecordedCardioExercise)) {
      return this;
    }
    return this.withExercise(
      exerciseIndex,
      exercise.withSet(setIndex, (set) => update(set).withCompletionTimeIfCompleted(now)),
    );
  }

  /** Only one cardio clock runs at a time, so whatever another set had going is banked first. */
  withCardioTimerStarted(exerciseIndex: number, setIndex: number, now: OffsetDateTime): Session {
    const running = this.runningCardioSet;
    const banked = running
      ? this.withExercise(
          running.exerciseIndex,
          running.exercise.withAllSets((set) =>
            set.isTimerRunning ? set.withTimerStopped(now).withCompletionTimeIfCompleted(now) : set,
          ),
        )
      : this;

    const exercise = banked.recordedExercises[exerciseIndex];
    if (!(exercise instanceof RecordedCardioExercise)) {
      return banked;
    }
    return banked.withExercise(
      exerciseIndex,
      exercise.withSet(setIndex, (set) => set.withTimerStarted(now)),
    );
  }

  get nextExercise(): RecordedExercise | undefined {
    const recordedExercises = this.recordedExercises;
    const cardioExerciseWithRunningTimer = this.runningCardioSet?.exercise;
    if (cardioExerciseWithRunningTimer) {
      return cardioExerciseWithRunningTimer;
    }
    const latestExerciseIndex = Enumerable.from(recordedExercises)
      .select(indexed)
      .where((x) => x.item.isStarted)
      .orderByDescending(({ item }) => item.latestTime, TemporalComparer)
      .select((x) => x.index)
      .firstOrDefault(-1);

    const latestExerciseSupersetsWithNext = match(latestExerciseIndex)
      .with(-1, () => false)
      .with(recordedExercises.length - 1, () => false) // can never superset with next if its the last exercise
      .otherwise(
        (i) =>
          recordedExercises[i] instanceof RecordedWeightedExercise && recordedExercises[i].blueprint.supersetWithNext,
      );

    const latestExerciseSupersetsWithPrevious = match(latestExerciseIndex)
      .with(P.union(-1, 0), () => false)
      .otherwise((i) => {
        const prevIndex = i - 1;
        return (
          recordedExercises[prevIndex] instanceof RecordedWeightedExercise &&
          recordedExercises[prevIndex].blueprint.supersetWithNext
        );
      });

    if (latestExerciseSupersetsWithNext && !recordedExercises[latestExerciseIndex + 1]?.isComplete) {
      return recordedExercises[latestExerciseIndex + 1];
    }

    // loop back to the original exercise in the case of a superset chain
    if (latestExerciseSupersetsWithPrevious) {
      let indexToJumpBackTo = latestExerciseIndex - 1;
      while (
        indexToJumpBackTo >= 0 &&
        recordedExercises[indexToJumpBackTo] instanceof RecordedWeightedExercise &&
        (recordedExercises[indexToJumpBackTo]!.blueprint as WeightedExerciseBlueprint).supersetWithNext
      ) {
        indexToJumpBackTo--;
      }
      // We are now at an exercise which is not supersetting with the next,
      // so jump forward to the next exercise
      indexToJumpBackTo++;
      // Now jump to the first exercise which has remaining sets in the chain
      while (indexToJumpBackTo < recordedExercises.length && recordedExercises[indexToJumpBackTo]!.isComplete) {
        indexToJumpBackTo++;
      }

      if (indexToJumpBackTo < recordedExercises.length) {
        return recordedExercises[indexToJumpBackTo];
      }
    }

    let result: RecordedExercise | undefined = undefined;
    let maxEpochSecond = Number.MIN_VALUE;

    for (const recordedExercise of recordedExercises) {
      if (!recordedExercise.isComplete) {
        const latestTime = recordedExercise.latestTime;
        const epochSecond = latestTime?.toEpochSecond() ?? Number.MIN_VALUE;

        if (epochSecond > maxEpochSecond || !result) {
          maxEpochSecond = epochSecond;
          result = recordedExercise;
        }
      }
    }
    return result;
  }

  get restTimerEndTime(): OffsetDateTime | undefined {
    if (!this.restTimer || this.restTimer.isPaused) {
      return undefined;
    }
    const exercise =
      this.restTimer.exerciseIndex !== undefined
        ? this.recordedExercises[this.restTimer.exerciseIndex]
        : this.lastExercise;
    if (this.nextExercise && exercise && exercise.latestTime && exercise instanceof RecordedWeightedExercise) {
      const lastSet = exercise.lastRecordedSet;
      const isWarmUp = lastSet?.set?.type === 'warmUp';
      const { minRest, failureRest } = isWarmUp ? Rest.short : exercise.blueprint.restBetweenSets;

      const targetMin = lastSet?.set
        ? exercise.repsTargetForSet(exercise.potentialSets.indexOf(lastSet)).min
        : undefined;
      const rest =
        targetMin === undefined ? Duration.ZERO : lastSet!.set!.repsCompleted >= targetMin ? minRest : failureRest;

      if (rest.equals(Duration.ZERO)) {
        return undefined;
      }
      return this.restTimer.startedAt.plus(rest);
    }
  }

  get lastExercise(): RecordedExercise | undefined {
    return Enumerable.from(this.recordedExercises)
      .where((x) => x.isStarted)
      .defaultIfEmpty(undefined)
      .maxBy((x) => x.latestTime?.toInstant().toEpochMilli());
  }

  get latestWeightedExercise(): RecordedWeightedExercise | undefined {
    return Enumerable.from(this.recordedExercises)
      .where((x) => x.isStarted)
      .where((x) => x instanceof RecordedWeightedExercise)
      .defaultIfEmpty(undefined)
      .maxBy((x) => x.latestTime?.toInstant().toEpochMilli());
  }

  get firstExercise(): RecordedExercise | undefined {
    return Enumerable.from(this.recordedExercises)
      .where((x) => x.isStarted)
      .defaultIfEmpty(undefined)
      .minBy((x) => x.latestTime?.toInstant().toEpochMilli());
  }

  get isFreeform(): boolean {
    return this.blueprint.name === 'Freeform Workout';
  }
}

export const EmptySession: Session = new Session(
  '00000000-0000-0000-0000-000000000000',
  new SessionBlueprint('', [], ''),
  [],
  LocalDate.MIN,
  undefined,
  undefined,
);

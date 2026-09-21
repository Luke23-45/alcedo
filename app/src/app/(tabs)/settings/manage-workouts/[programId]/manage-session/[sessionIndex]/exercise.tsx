import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ExerciseBlueprint } from '@/models/blueprint-models';
import { useAppSelector } from '@/store';
import { selectProgramSessionExercise, updateProgram } from '@/store/program';
import { ExerciseEditorScreen } from '@/components/presentation/settings/programs/exercise-editor-screen';

/**
 * The per-exercise editor inside a program session. Thin wrapper; the UI
 * lives in components/presentation/settings/programs/.
 */
export default function ExercisePage() {
  const { sessionIndex, programId, exerciseIndex } = useLocalSearchParams<{
    sessionIndex: string;
    programId: string;
    exerciseIndex: string;
  }>();
  const location = {
    programId,
    sessionIndex: Number(sessionIndex),
    exerciseIndex: Number(exerciseIndex),
  };
  const exercise = useAppSelector((x) => selectProgramSessionExercise(x, location));
  const dispatch = useDispatch();
  const { dismiss } = useRouter();

  const hasExercise = !!exercise;
  useEffect(() => {
    if (!hasExercise) {
      dismiss();
    }
  }, [hasExercise, dismiss]);
  if (!exercise) {
    return;
  }

  const saveExercise = (exerciseToSave: ExerciseBlueprint) => {
    dispatch(
      updateProgram({
        programId: location.programId,
        update: (program) =>
          program.withSession(location.sessionIndex, (session) =>
            session.withExercise(location.exerciseIndex, exerciseToSave),
          ),
      }),
    );
  };

  return <ExerciseEditorScreen exercise={exercise} updateExercise={saveExercise} />;
}

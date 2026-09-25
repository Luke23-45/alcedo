package expo.modules.workoutworker.utils

import com.powergym.alcedo.AllSetsScope
import com.powergym.alcedo.CardioExerciseBlueprint
import com.powergym.alcedo.CardioTarget
import com.powergym.alcedo.DistanceCardioTarget
import com.powergym.alcedo.FinishWorkoutCommand
import com.powergym.alcedo.LowestSetsScope
import com.powergym.alcedo.SetScope
import com.powergym.alcedo.RecordedCardioExercise
import com.powergym.alcedo.RecordedExercise
import com.powergym.alcedo.RecordedWeightedExercise
import com.powergym.alcedo.TimeCardioTarget
import com.powergym.alcedo.WeightedExerciseBlueprint
import com.powergym.alcedo.WorkoutEndedEvent
import com.powergym.alcedo.WorkoutMessagePayload
import com.powergym.alcedo.WorkoutStartedEvent
import com.powergym.alcedo.WorkoutUpdatedEvent
import com.squareup.moshi.JsonAdapter
import com.squareup.moshi.JsonReader
import com.squareup.moshi.JsonWriter
import com.squareup.moshi.Moshi
import com.squareup.moshi.adapter
import com.squareup.moshi.adapters.PolymorphicJsonAdapterFactory
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import java.math.BigDecimal
import kotlin.time.Instant

class InstantAdapter : JsonAdapter<Instant>() {
    override fun fromJson(reader: JsonReader): Instant =
        Instant.parse(reader.nextString())

    override fun toJson(writer: JsonWriter, value: Instant?) {
        writer.value(value?.toString())
    }
}

class BigDecimalAdapter : JsonAdapter<BigDecimal>() {
    override fun fromJson(reader: JsonReader): BigDecimal =
        BigDecimal(reader.nextString())

    override fun toJson(writer: JsonWriter, value: BigDecimal?) {
        writer.value(value?.toString())
    }
}

object Json {
    val moshi: Moshi = Moshi.Builder()
        .add(
            PolymorphicJsonAdapterFactory.of(WorkoutMessagePayload::class.java, "type")
                .withSubtype(WorkoutStartedEvent::class.java, "WorkoutStartedEvent")
                .withSubtype(WorkoutUpdatedEvent::class.java, "WorkoutUpdatedEvent")
                .withSubtype(WorkoutEndedEvent::class.java, "WorkoutEndedEvent")
                .withSubtype(FinishWorkoutCommand::class.java, "FinishWorkoutCommand")
        )
        .add(
            PolymorphicJsonAdapterFactory.of(RecordedExercise::class.java, "type")
                .withSubtype(RecordedCardioExercise::class.java, "RecordedCardioExercise")
                .withSubtype(RecordedWeightedExercise::class.java, "RecordedWeightedExercise")
        )
        .add(
            PolymorphicJsonAdapterFactory.of(CardioTarget::class.java, "type")
                .withSubtype(DistanceCardioTarget::class.java, "distance")
                .withSubtype(TimeCardioTarget::class.java, "time")
        )
        .add(
            PolymorphicJsonAdapterFactory.of(SetScope::class.java, "type")
                .withSubtype(AllSetsScope::class.java, "allSets")
                .withSubtype(LowestSetsScope::class.java, "lowestSets")
        )
        .add(Instant::class.java, InstantAdapter())
        .add(BigDecimal::class.java, BigDecimalAdapter())
        .addLast(KotlinJsonAdapterFactory())
        .build()

    @OptIn(ExperimentalStdlibApi::class)
    inline fun <reified T> decodeFromString(json: String): T {


        val jsonAdapter: JsonAdapter<T> = moshi.adapter<T>()

        return jsonAdapter.fromJson(json) as T
    }

    @OptIn(ExperimentalStdlibApi::class)
    inline fun <reified T> encodeToString(value: T): String {


        val jsonAdapter: JsonAdapter<T> = moshi.adapter<T>()

        return jsonAdapter.toJson(value)
    }
}

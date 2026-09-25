package expo.modules.workoutworker.handlers


import com.powergym.alcedo.WorkoutMessage
import com.powergym.alcedo.WorkoutStartedEvent
import expo.modules.workoutworker.utils.WorkoutNotificationManager
import kotlin.time.ExperimentalTime


class WorkoutStartedHandler(
    private val notificationManager: WorkoutNotificationManager
) : WorkoutMessageHandler {
    override fun canHandle(event: WorkoutMessage): Boolean {
        return event.payload is WorkoutStartedEvent && event.appConfiguration.notificationsEnabled
    }

    @OptIn(ExperimentalTime::class)
    override suspend fun handle(
        event: WorkoutMessage,
        dispatch: (type: String, event: WorkoutMessage) -> Unit
    ) {

        notificationManager.resetPromotion()
        val notifBuilder = notificationManager.createWorkoutNotificationBuilder()
            .setContentText(event.translations.workoutPersistentNotificationInProgressMessage)
        notificationManager.notifyPersistent(notifBuilder.build())
    }
}

package expo.modules.workoutworker.handlers


import com.powergym.alcedo.WorkoutEndedEvent
import com.powergym.alcedo.WorkoutMessage
import expo.modules.workoutworker.utils.WorkoutNotificationManager


class WorkoutEndedHandler(
    private val notificationManager: WorkoutNotificationManager
) : WorkoutMessageHandler {
    override fun canHandle(event: WorkoutMessage): Boolean {
        return event.payload is WorkoutEndedEvent
    }

    override suspend fun handle(
        event: WorkoutMessage,
        dispatch: (type: String, event: WorkoutMessage) -> Unit
    ) {
        notificationManager.clearPersistentNotification()
    }

}

import { ScheduledRun } from '../types';

interface ScheduleListProps {
  schedules: ScheduledRun[];
  onEdit: (schedule: ScheduledRun) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
}

export default function ScheduleList({
  schedules,
  onEdit,
  onDelete,
  onToggleActive,
}: ScheduleListProps) {
  const formatScheduledTime = (time: string): string => {
    const date = new Date(time);
    return date.toLocaleString('ja-JP', {
      month: 'short',
      day: 'numeric',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRecurrenceLabel = (schedule: ScheduledRun): string => {
    switch (schedule.recurrence.type) {
      case 'daily':
        return '毎日';
      case 'weekly': {
        const days = schedule.recurrence.daysOfWeek || [];
        const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
        return `毎週 ${days.map((d) => dayNames[d]).join(', ')}`;
      }
      default:
        return '一回限り';
    }
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`「${title}」を削除しますか？`)) {
      onDelete(id);
    }
  };

  if (schedules.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          スケジュールがありません
        </h3>
        <p className="text-gray-600">
          新しいスケジュールを作成してランニングの計画を立てましょう
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {schedules.map((schedule) => (
        <div
          key={schedule.id}
          className={`bg-white rounded-lg shadow p-6 transition-opacity ${
            !schedule.isActive ? 'opacity-60' : ''
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {schedule.title}
                </h3>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    schedule.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {schedule.isActive ? 'アクティブ' : 'オフ'}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{formatScheduledTime(schedule.scheduledTime)}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>{getRecurrenceLabel(schedule)}</span>
              </div>

              {schedule.description && (
                <p className="text-sm text-gray-600 mt-2">{schedule.description}</p>
              )}

              {schedule.goal && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {schedule.goal.targetDistance && (
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                      📏 {schedule.goal.targetDistance}km
                    </span>
                  )}
                  {schedule.goal.targetPace && (
                    <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-md">
                      ⚡ {schedule.goal.targetPace}分/km
                    </span>
                  )}
                  {schedule.goal.targetDuration && (
                    <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md">
                      ⏱️ {Math.floor(schedule.goal.targetDuration / 60000)}分
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* アクティブトグル */}
            <button
              onClick={() => onToggleActive(schedule.id, !schedule.isActive)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ml-4 ${
                schedule.isActive ? 'bg-green-600' : 'bg-gray-300'
              }`}
              title={schedule.isActive ? 'オフにする' : 'オンにする'}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  schedule.isActive ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* アクションボタン */}
          <div className="flex gap-2 pt-4 border-t">
            <button
              onClick={() => onEdit(schedule)}
              className="flex-1 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700
                       font-medium rounded-lg transition-colors"
            >
              編集
            </button>
            <button
              onClick={() => handleDelete(schedule.id, schedule.title)}
              className="flex-1 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700
                       font-medium rounded-lg transition-colors"
            >
              削除
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { ScheduledRun, RecurrenceType, RunGoal, RecurrencePattern } from '../types';

interface ScheduleFormProps {
  schedule?: ScheduledRun | null;
  onSubmit: (schedule: Partial<ScheduledRun>) => Promise<void>;
  onCancel: () => void;
}

export default function ScheduleForm({ schedule, onSubmit, onCancel }: ScheduleFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>('none');
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([]);
  const [targetDistance, setTargetDistance] = useState('');
  const [targetPace, setTargetPace] = useState('');
  const [targetDuration, setTargetDuration] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dayNames = ['日', '月', '火', '水', '木', '金', '土'];

  useEffect(() => {
    if (schedule) {
      setTitle(schedule.title);
      setDescription(schedule.description || '');

      const date = new Date(schedule.scheduledTime);
      setScheduledDate(date.toISOString().split('T')[0]);
      setScheduledTime(
        `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
      );

      setRecurrenceType(schedule.recurrence.type);
      setDaysOfWeek(schedule.recurrence.daysOfWeek || []);

      if (schedule.goal) {
        setTargetDistance(schedule.goal.targetDistance?.toString() || '');
        setTargetPace(schedule.goal.targetPace?.toString() || '');
        setTargetDuration(
          schedule.goal.targetDuration
            ? (schedule.goal.targetDuration / 60000).toString()
            : ''
        );
      }
    } else {
      // デフォルト値を設定（現在時刻+1時間）
      const now = new Date();
      now.setHours(now.getHours() + 1);
      now.setMinutes(0);
      setScheduledDate(now.toISOString().split('T')[0]);
      setScheduledTime(
        `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      );
    }
  }, [schedule]);

  const toggleDayOfWeek = (day: number) => {
    if (daysOfWeek.includes(day)) {
      setDaysOfWeek(daysOfWeek.filter((d) => d !== day));
    } else {
      setDaysOfWeek([...daysOfWeek, day].sort());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // バリデーション
    if (!title.trim()) {
      setError('タイトルを入力してください');
      return;
    }

    if (!scheduledDate || !scheduledTime) {
      setError('日時を設定してください');
      return;
    }

    if (recurrenceType === 'weekly' && daysOfWeek.length === 0) {
      setError('繰り返す曜日を選択してください');
      return;
    }

    try {
      setIsSubmitting(true);

      const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);

      const recurrence: RecurrencePattern = {
        type: recurrenceType,
        ...(recurrenceType === 'weekly' && { daysOfWeek }),
      };

      const goal: RunGoal | undefined =
        targetDistance || targetPace || targetDuration
          ? {
              ...(targetDistance && { targetDistance: parseFloat(targetDistance) }),
              ...(targetPace && { targetPace: parseFloat(targetPace) }),
              ...(targetDuration && {
                targetDuration: parseFloat(targetDuration) * 60000,
              }),
            }
          : undefined;

      const scheduleData: Partial<ScheduledRun> = {
        title: title.trim(),
        description: description.trim() || undefined,
        scheduledTime: scheduledDateTime.toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        recurrence,
        goal,
      };

      await onSubmit(scheduleData);
    } catch (err: any) {
      setError(err.message || 'スケジュールの保存に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* タイトル */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          タイトル <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="例: 朝ラン、夕方ジョギング"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2
                   focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      {/* 説明 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          説明（任意）
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="例: 公園を2周、ゆっくりペースで"
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2
                   focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* 日時 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            日付 <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2
                     focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            時刻 <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2
                     focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>

      {/* 繰り返し */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          繰り返し
        </label>
        <select
          value={recurrenceType}
          onChange={(e) => setRecurrenceType(e.target.value as RecurrenceType)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2
                   focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="none">繰り返さない</option>
          <option value="daily">毎日</option>
          <option value="weekly">毎週</option>
        </select>

        {recurrenceType === 'weekly' && (
          <div className="mt-3">
            <p className="text-sm text-gray-600 mb-2">曜日を選択</p>
            <div className="flex gap-2">
              {dayNames.map((day, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => toggleDayOfWeek(index)}
                  className={`flex-1 py-2 rounded-lg border-2 transition-colors ${
                    daysOfWeek.includes(index)
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-blue-300'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 目標設定 */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">目標（任意）</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              目標距離（km）
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={targetDistance}
              onChange={(e) => setTargetDistance(e.target.value)}
              placeholder="5.0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2
                       focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              目標ペース（分/km）
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={targetPace}
              onChange={(e) => setTargetPace(e.target.value)}
              placeholder="6.0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2
                       focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              目標時間（分）
            </label>
            <input
              type="number"
              step="1"
              min="0"
              value={targetDuration}
              onChange={(e) => setTargetDuration(e.target.value)}
              placeholder="30"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2
                       focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* ボタン */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium
                   rounded-lg hover:bg-gray-50 disabled:bg-gray-100 transition-colors"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300
                   text-white font-medium rounded-lg transition-colors"
        >
          {isSubmitting ? '保存中...' : schedule ? '更新' : '作成'}
        </button>
      </div>
    </form>
  );
}

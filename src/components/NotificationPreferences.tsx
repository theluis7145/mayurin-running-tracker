import { useState, useEffect } from 'react';
import { NotificationPreferences as NotificationPreferencesType } from '../types';

interface NotificationPreferencesProps {
  preferences: NotificationPreferencesType | null;
  isLineConnected: boolean;
  onUpdate: (preferences: NotificationPreferencesType) => Promise<void>;
}

export default function NotificationPreferences({
  preferences,
  isLineConnected,
  onUpdate,
}: NotificationPreferencesProps) {
  const [enabled, setEnabled] = useState(preferences?.enabled ?? true);
  const [reminderMinutes, setReminderMinutes] = useState(
    preferences?.reminderMinutesBefore ?? 60
  );
  const [notifyOnCreate, setNotifyOnCreate] = useState(
    preferences?.notifyOnScheduleCreated ?? true
  );
  const [notifyOnComplete, setNotifyOnComplete] = useState(
    preferences?.notifyOnScheduleCompleted ?? false
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    if (preferences) {
      setEnabled(preferences.enabled);
      setReminderMinutes(preferences.reminderMinutesBefore);
      setNotifyOnCreate(preferences.notifyOnScheduleCreated);
      setNotifyOnComplete(preferences.notifyOnScheduleCompleted);
    }
  }, [preferences]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveMessage(null);

      const newPreferences: NotificationPreferencesType = {
        enabled,
        reminderMinutesBefore: reminderMinutes,
        notifyOnScheduleCreated: notifyOnCreate,
        notifyOnScheduleCompleted: notifyOnComplete,
      };

      await onUpdate(newPreferences);
      setSaveMessage('設定を保存しました');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error: any) {
      setSaveMessage(error.message || '設定の保存に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLineConnected) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          通知設定を利用するには、まずLINE Notifyと連携してください。
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">通知設定</h3>

        {saveMessage && (
          <div
            className={`mb-4 p-3 rounded-md ${
              saveMessage.includes('失敗')
                ? 'bg-red-50 border border-red-200 text-red-600'
                : 'bg-green-50 border border-green-200 text-green-600'
            }`}
          >
            <p className="text-sm">{saveMessage}</p>
          </div>
        )}

        {/* 通知ON/OFF */}
        <div className="flex items-center justify-between py-3 border-b">
          <div>
            <p className="font-medium text-gray-900">通知を有効にする</p>
            <p className="text-sm text-gray-600">
              すべてのリマインダー通知を受け取る
            </p>
          </div>
          <button
            onClick={() => setEnabled(!enabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
              ${enabled ? 'bg-blue-600' : 'bg-gray-200'}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
        </div>

        {/* リマインダータイミング */}
        <div className="py-4 border-b">
          <label className="block font-medium text-gray-900 mb-2">
            リマインダータイミング
          </label>
          <p className="text-sm text-gray-600 mb-3">
            スケジュールの何分前に通知を受け取るか
          </p>
          <select
            value={reminderMinutes}
            onChange={(e) => setReminderMinutes(Number(e.target.value))}
            disabled={!enabled}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2
                     focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100
                     disabled:cursor-not-allowed"
          >
            <option value={15}>15分前</option>
            <option value={30}>30分前</option>
            <option value={60}>1時間前</option>
            <option value={120}>2時間前</option>
            <option value={180}>3時間前</option>
            <option value={1440}>1日前</option>
          </select>
        </div>

        {/* スケジュール作成時の通知 */}
        <div className="flex items-center justify-between py-3 border-b">
          <div>
            <p className="font-medium text-gray-900">スケジュール作成時</p>
            <p className="text-sm text-gray-600">
              新しいスケジュールを作成したときに通知
            </p>
          </div>
          <button
            onClick={() => setNotifyOnCreate(!notifyOnCreate)}
            disabled={!enabled}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
              ${notifyOnCreate && enabled ? 'bg-blue-600' : 'bg-gray-200'}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                ${notifyOnCreate ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
        </div>

        {/* スケジュール完了時の通知 */}
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="font-medium text-gray-900">スケジュール完了時</p>
            <p className="text-sm text-gray-600">
              スケジュールを完了したときに通知
            </p>
          </div>
          <button
            onClick={() => setNotifyOnComplete(!notifyOnComplete)}
            disabled={!enabled}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
              ${notifyOnComplete && enabled ? 'bg-blue-600' : 'bg-gray-200'}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                ${notifyOnComplete ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300
                 text-white font-medium rounded-lg transition-colors"
      >
        {isSaving ? '保存中...' : '設定を保存'}
      </button>
    </div>
  );
}

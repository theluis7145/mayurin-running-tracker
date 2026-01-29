import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSchedules } from '../hooks/useSchedules';
import { ScheduledRun } from '../types';
import LineMessagingConnect from '../components/LineMessagingConnect';
import NotificationPreferences from '../components/NotificationPreferences';
import ScheduleForm from '../components/ScheduleForm';
import ScheduleList from '../components/ScheduleList';

type Tab = 'schedules' | 'settings';

export default function Schedules() {
  const { user } = useAuth();
  const {
    schedules,
    isLineConnected,
    lineMessagingProfile,
    notificationPreferences,
    isLoading,
    error,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    toggleActive,
    updateNotificationPreferences,
  } = useSchedules(user?.uid || null);

  const [activeTab, setActiveTab] = useState<Tab>('schedules');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduledRun | null>(null);

  const handleCreate = () => {
    setEditingSchedule(null);
    setIsFormOpen(true);
  };

  const handleEdit = (schedule: ScheduledRun) => {
    setEditingSchedule(schedule);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (scheduleData: Partial<ScheduledRun>) => {
    if (editingSchedule) {
      await updateSchedule(editingSchedule.id, scheduleData);
    } else {
      await createSchedule(scheduleData);
    }
    setIsFormOpen(false);
    setEditingSchedule(null);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingSchedule(null);
  };

  const handleDelete = async (id: string) => {
    await deleteSchedule(id);
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    await toggleActive(id, isActive);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4" />
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">スケジュール</h1>
          <p className="text-gray-600">
            ランニングの予定を管理して、リマインダーを受け取りましょう
          </p>
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* タブ */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('schedules')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === 'schedules'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              マイスケジュール
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === 'settings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              設定
            </button>
          </div>
        </div>

        {/* マイスケジュールタブ */}
        {activeTab === 'schedules' && (
          <div className="space-y-6">
            {/* 作成ボタン */}
            {!isFormOpen && (
              <button
                onClick={handleCreate}
                className="w-full px-6 py-4 bg-blue-500 hover:bg-blue-600 text-white
                         font-medium rounded-lg shadow-md transition-colors flex items-center
                         justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                新しいスケジュールを作成
              </button>
            )}

            {/* フォーム */}
            {isFormOpen && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {editingSchedule ? 'スケジュールを編集' : '新しいスケジュール'}
                </h2>
                <ScheduleForm
                  schedule={editingSchedule}
                  onSubmit={handleFormSubmit}
                  onCancel={handleFormCancel}
                />
              </div>
            )}

            {/* スケジュール一覧 */}
            <ScheduleList
              schedules={schedules}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
            />
          </div>
        )}

        {/* 設定タブ */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* LINE Messaging連携 */}
            <LineMessagingConnect
              profile={lineMessagingProfile}
              isConnected={isLineConnected}
            />

            {/* 通知設定 */}
            <NotificationPreferences
              preferences={notificationPreferences}
              isLineConnected={isLineConnected}
              onUpdate={updateNotificationPreferences}
            />

            {/* 情報 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                LINE連携について
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• LINE公式アカウントからリマインダーが届きます</li>
                <li>• 設定した時刻の指定分前に通知が届きます</li>
                <li>• スケジュールをオフにすると通知は送信されません</li>
                <li>• いつでも連携を解除できます</li>
                <li>• 月1000通まで無料で利用できます</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

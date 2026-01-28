import { UserProfile } from '../types';
import { getGreetingMessage, getTimeGradient } from '../utils/greeting';

interface ProfileHeaderProps {
  profile: UserProfile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const greeting = getGreetingMessage(profile.nickname);
  const gradient = getTimeGradient();

  return (
    <div className={`bg-gradient-to-r ${gradient} text-white py-6 px-4 shadow-md`}>
      <div className="max-w-2xl mx-auto flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden flex-shrink-0">
          {profile.avatarBase64 ? (
            <img
              src={profile.avatarBase64}
              alt="プロフィール"
              className="w-full h-full object-cover"
            />
          ) : (
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold truncate">{greeting}</h1>
          <p className="text-sm text-white/80 mt-0.5">Running Tracker</p>
        </div>
      </div>
    </div>
  );
}

import { UserProfile } from '../types';
import { getGreetingMessage } from '../utils/greeting';

interface ProfileHeaderProps {
  profile: UserProfile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const greeting = getGreetingMessage(profile.nickname);

  return (
    <div className="bg-black text-white py-8 sm:py-10 px-6 border-b border-gray-900 safe-top">
      <div className="max-w-4xl mx-auto flex items-center gap-5">
        <div className="w-14 h-14 rounded-full bg-white shadow-2xl flex items-center justify-center overflow-hidden flex-shrink-0">
          {profile.avatarBase64 ? (
            <img
              src={profile.avatarBase64}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-2xl md:text-3xl font-bold truncate tracking-tight">{greeting}</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 tracking-wide">RUNNING TRACKER</p>
        </div>
      </div>
    </div>
  );
}

import { UserProfile } from '../types';
import { getGreetingMessage, getTimeEmoji } from '../utils/greeting';

interface ProfileHeaderProps {
  profile: UserProfile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const greeting = getGreetingMessage(profile.nickname);
  const emoji = getTimeEmoji();

  return (
    <div className="bg-gradient-to-r from-sky-400 to-sun-400 text-white py-6 px-4 shadow-md">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden">
          {profile.avatarBase64 ? (
            <img
              src={profile.avatarBase64}
              alt="プロフィール"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-3xl">👤</span>
          )}
        </div>
        <div>
          <div className="text-2xl font-bold">
            {emoji} {greeting}
          </div>
        </div>
      </div>
    </div>
  );
}

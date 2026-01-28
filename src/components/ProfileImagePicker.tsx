import { useRef, useState } from 'react';
import { resizeAndCompressImage, isImageFile, formatFileSize, getBase64Size } from '../utils/imageUtils';

interface ProfileImagePickerProps {
  currentImage?: string;
  onImageSelect: (base64: string) => void;
}

export function ProfileImagePicker({ currentImage, onImageSelect }: ProfileImagePickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // 画像ファイルかチェック
    if (!isImageFile(file)) {
      setError('画像ファイルを選択してね');
      return;
    }

    // ファイルサイズチェック（10MB以上は警告）
    if (file.size > 10 * 1024 * 1024) {
      setError('ファイルサイズが大きすぎるよ（10MB以下にしてね）');
      return;
    }

    setIsProcessing(true);

    try {
      // 画像をリサイズ・圧縮
      const base64 = await resizeAndCompressImage(file, 200, 200, 0.8);
      const compressedSize = getBase64Size(base64);

      console.log(`画像を圧縮しました: ${formatFileSize(file.size)} → ${formatFileSize(compressedSize)}`);

      onImageSelect(base64);
    } catch (err) {
      setError('画像の処理に失敗しちゃった');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    onImageSelect('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* 画像プレビュー */}
      <div
        onClick={handleClick}
        className="w-32 h-32 rounded-full bg-sky-100 flex items-center justify-center overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-200 border-4 border-white"
      >
        {currentImage ? (
          <img src={currentImage} alt="プロフィール" className="w-full h-full object-cover" />
        ) : (
          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )}
      </div>

      {/* ボタン */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={handleClick}
          disabled={isProcessing}
          className="px-4 py-2 bg-sky-500 text-white text-sm font-medium rounded-lg hover:bg-sky-600 disabled:bg-gray-400 transition-colors duration-200"
        >
          {isProcessing ? '処理中...' : currentImage ? '画像を変更' : '画像を選択'}
        </button>

        {currentImage && (
          <button
            onClick={handleRemove}
            className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-400 transition-colors duration-200"
          >
            削除
          </button>
        )}
      </div>

      {/* 非表示のファイル入力 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* エラーメッセージ */}
      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* ヘルプテキスト */}
      <div className="mt-2 text-xs text-gray-500 text-center">
        推奨: 正方形の画像、10MB以下
        <br />
        自動的に200x200pxにリサイズされます
      </div>
    </div>
  );
}

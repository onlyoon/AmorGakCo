"use client";
// src/app/refresh/page.tsx

import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

const RefreshTokenPage = () => {
  const [message, setMessage] = useState('');

  const refreshTokenMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('https://amorgakco.store/tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', // 요청 타입
        },
        credentials: 'include', // 쿠키를 포함해서 요청을 보냄
      });

      if (!response.ok) {
        throw new Error('토큰 재발급 실패');
      }

      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      // 성공적으로 토큰을 재발급받았을 때 처리
      setMessage('토큰이 재발급되었습니다.');
      // 필요한 경우 재발급된 토큰으로 새로운 작업을 처리
    },
    onError: (error) => {
      // 에러가 발생했을 때 처리
      setMessage('토큰 재발급에 실패했습니다.');
    },
  });

  const handleRefresh = () => {
    refreshTokenMutation.mutate();
  };

  const isLoading = refreshTokenMutation.status === 'pending';
  const isError = refreshTokenMutation.status === 'error';
  const isSuccess = refreshTokenMutation.status === 'success';

  return (
    <div>
      <h1>리프레시 토큰 재발급</h1>
      <button onClick={handleRefresh} disabled={isLoading}>
        토큰 재발급 요청
      </button>
      {isLoading && <p>요청 중...</p>}
      {isSuccess && <p>토큰이 재발급되었습니다.</p>}
      {isError && <p>토큰 재발급에 실패했습니다.</p>}
      {message && !isLoading && !isError && !isSuccess && <p>{message}</p>}
    </div>
  );
};

export default RefreshTokenPage;
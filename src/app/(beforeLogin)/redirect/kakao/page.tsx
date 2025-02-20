"use client"

import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cookies } from "next/headers";

export default function Login() {
  const router = useRouter();
  const [authCode, setAuthCode] = useState('')

  const loginURL = `${process.env.NEXT_PUBLIC_KAKAO_LOGIN_URL!}?authCode=${authCode}`

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(loginURL, {
        method: 'POST',
        credentials: 'include',
      },)

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    },
    onSuccess: data => {
      console.log('Login Successful', data)
      console.log(data.status)
      console.log(data.path)
      console.log(data.data.oauth2MemberResponse)
      console.log(data.data.accessToken)
      // router.push('/home')
    },
    onError: error => {
      console.error('Login Failed', error)
    }
  })

  // authCode를 넣는 과정
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    if (code) {
      setAuthCode(code)
    }
  }, [])

  useEffect(() => {
    if (authCode !== '') {
      mutation.mutate()
    }
  }, [authCode])

  return <div>Redirecting...</div>
}
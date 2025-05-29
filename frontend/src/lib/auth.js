'use client'
import Cookies from 'js-cookie'

export const saveToken = (token) => {
  Cookies.set('token', token, { expires: 1 / 1440 })
}

export const getToken = () => Cookies.get('token')
export const removeToken = () => Cookies.remove('token')
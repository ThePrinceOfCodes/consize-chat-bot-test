import httpStatus from 'http-status'
import { Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'
import { tokenService } from '../token'
import { userService } from '../user'
import * as authService from './auth.service'
import { emailService } from '../email'
import { IUserDoc } from '../user/user.interfaces'
import { agenda } from '../scheduler'
import { SEND_FORGOT_PASSWORD_EMAIL, SEND_VERIFICATION_EMAIL } from '../scheduler/MessageTypes'
import { SEND_VERIFICATION_MESSAGE } from '../scheduler/jobs/sendMessage'

export const register = catchAsync(async (req: Request, _: Response) => {
  let user: IUserDoc | null = await userService.registerUser(req.body)
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(user)
  emailService.sendVerificationEmail(user.email, user.name.split(' ')[0] || 'customer', verifyEmailToken)
  
})

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body
  const user = await authService.loginUserWithEmailAndPassword(email, password)
  const tokens = await tokenService.generateAuthTokens(user)
  res.send({ user, tokens })
})

export const logout = catchAsync(async (req: Request, res: Response) => {
  await authService.logout(req.body.refreshToken)
  res.status(httpStatus.NO_CONTENT).send()
})

export const refreshTokens = catchAsync(async (req: Request, res: Response) => {
  const userWithTokens = await authService.refreshAuth(req.body.refreshToken)
  res.send({ ...userWithTokens })
})

export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { resetPasswordToken, user } = await tokenService.generateResetPasswordToken(req.body.email)
  agenda.now<SEND_VERIFICATION_MESSAGE>(SEND_FORGOT_PASSWORD_EMAIL, {
    code: resetPasswordToken, name: user.name, email: user.email
  })
  res.status(httpStatus.NO_CONTENT).send()
})

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  await authService.resetPassword(req.query['token'], req.body.password)
  res.status(httpStatus.NO_CONTENT).send()
})

export const sendVerificationEmail = catchAsync(async (req: Request, res: Response) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user)
  await emailService.sendVerificationEmail(req.user.email, req.user.name, verifyEmailToken)
  agenda.now<SEND_VERIFICATION_MESSAGE>(SEND_VERIFICATION_EMAIL, {
    code: verifyEmailToken, name: req.user.name, email: req.user.email
  })
  res.status(httpStatus.NO_CONTENT).send()
})

export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  await authService.verifyEmail(req.query['token'])
  res.status(httpStatus.NO_CONTENT).send()
})

import { Router } from 'express'
import { confirmUploadHandler, deleteImageHandler, getAvatarHandler, listAvatarsHandler, presignHandler } from './avatar_controller'

const avatarRoute = Router()

//crud
avatarRoute.get('/', listAvatarsHandler)
avatarRoute.post('/', confirmUploadHandler)
avatarRoute.get('/:avatarId', getAvatarHandler)

avatarRoute.post('/:avatarId/images/presign', presignHandler)
avatarRoute.post('/:avatarId/images/confirm', confirmUploadHandler)
avatarRoute.post('/:avatarId/images/:imageid', deleteImageHandler)

export default avatarRoute;
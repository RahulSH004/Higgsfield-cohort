import {Router} from 'express';
import { createVideoHandler, getAllVideosHandler, getPublicFeedHandler, getVideoHandler, VideoRemixesHandler } from './video_controller';
import { authentication } from '../../middleware/auth.middleware';


const videoRoute = Router();

// Public feed route
videoRoute.get('/feeds', getPublicFeedHandler);

//private route 

videoRoute.get('/', authentication, getAllVideosHandler);
videoRoute.post('/', authentication, createVideoHandler);
videoRoute.get('/:videoId', authentication, getVideoHandler);
videoRoute.post('/:videoId/remix', authentication, VideoRemixesHandler);


export default videoRoute;
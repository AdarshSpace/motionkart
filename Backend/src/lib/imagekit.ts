import ImageKit from '@imagekit/nodejs';
import type { Request, Response } from 'express';

const client = new ImageKit({
  privateKey: process.env['IMAGEKIT_PRIVATE_KEY'], // This is the default and can be omitted
});

export const generateUploadAuth = (req: Request, res: Response) => {
  try{
    console.log('PrivateKey : ',process.env.IMAGEKIT_PRIVATE_KEY);
    const { token, expire, signature} = client.helper.getAuthenticationParameters();
    console.log('Token : ',token, 'Expire : ',expire, 'Signature : ',signature);
    res.send({token, expire, signature, publicKey: process.env.IMAGEKIT_PUBLIC_KEY });
  } catch (error) {
    console.log('Error : ',error);
    res.status(500).send({message: 'Internal server error'});
  }    
}


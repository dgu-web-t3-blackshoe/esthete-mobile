import { Platform } from 'react-native';
import MatrixMath from './MatrixMath';

export const rotateX = (dx: number) => {
  'worklet';

  const radY = (Math.PI / 180) * -dx;
  const cosY = Math.cos(radY);
  const sinY = Math.sin(radY);

  return [cosY, 0, sinY, 0, 0, 1, 0, 0, -sinY, 0, cosY, 0, 0, 0, 0, 1];
};

export const transformOrigin = (matrix: number[], origin: { x: number; y: number; z: number }) => {
  'worklet';
  const { x, y, z } = origin;

  const translate = MatrixMath.createIdentityMatrix();

  MatrixMath.reuseTranslate3dCommand(translate, x, y, z);
  MatrixMath.multiplyInto(matrix, translate, matrix);

  const untranslate = MatrixMath.createIdentityMatrix();
  MatrixMath.reuseTranslate3dCommand(untranslate, -x, -y, -z);
  MatrixMath.multiplyInto(matrix, matrix, untranslate);

  return matrix;
};

export const isAndroid = Platform.OS === 'android';


export const SERVER_IP = 'https://api.esthete.roberniro-projects.xyz/'
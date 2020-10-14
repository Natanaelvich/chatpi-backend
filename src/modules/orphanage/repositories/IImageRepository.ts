import ICreateImageDTO from '../dtos/ICreateImageDTO';
import Image from '../infra/typeorm/entities/Image';

export default interface IImageRepository {
  create(data: ICreateImageDTO): Promise<Image>;
  save(image: Image): Promise<Image>;
}

import { IsNotEmpty } from "class-validator";

export class MoveDto {
  @IsNotEmpty()
  x: number;

  @IsNotEmpty()
  y: number;
}

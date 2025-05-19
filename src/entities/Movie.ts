import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int" })
  year!: number;

  @Column({ type: "varchar" })
  title!: string;

  @Column({ type: "varchar" })
  producers!: string; // lista separada por vírgulas

  @Column({ type: "boolean" })
  winner!: boolean;
}

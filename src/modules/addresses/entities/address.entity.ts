import { Column, CreateDateColumn, Entity, OneToOne, JoinColumn, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Coordinate } from "modules/coordinates/entities/coordinate.entity";
import { User } from "modules/users/entities/user.entity";

@Entity()
export class Address {
  @PrimaryGeneratedColumn("uuid")
  public readonly id: string;

  @Column()
  public street: string;

  @Column()
  public city: string;

  @Column()
  public country: string;

  @OneToOne(() => Coordinate)
  @JoinColumn()
  public coordinate: Coordinate;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @OneToMany(() => User, user => user.address)
  public users: User[];
}

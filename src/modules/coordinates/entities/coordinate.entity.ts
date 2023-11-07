import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Coordinate {
  @PrimaryGeneratedColumn("uuid")
  public readonly id: string;

  @Column('decimal', { precision: 2, scale: 8 })
  public latitude: number;

  @Column('decimal', { precision: 2, scale: 8 })
  public longitude: number;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
import { SecretsService } from '@/modules/secrets/secrets.service';
import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly secretsService: SecretsService) {
    // You can inject other services here if needed
  }
  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    const options = await this.secretsService.getDatabaseOptions();

    // Optionally, you can initialize the DataSource here if needed
    // const dataSource = new DataSource(options);
    // await dataSource.initialize();

    return options as TypeOrmModuleOptions;
  }
}

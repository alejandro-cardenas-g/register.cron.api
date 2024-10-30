import { registerDecorator } from 'class-validator';
import { isValidCron } from 'cron-validator';

export function IsValidCronValidator() {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'IsValidCronValidator',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {},
      validator: {
        async validate(value: any) {
          if (typeof value !== 'string') return false;
          return isValidCron(value, { seconds: true });
        },
      },
    });
  };
}

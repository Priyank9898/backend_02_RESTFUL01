class BaseDto {
  static schema = null;

  static validate(data) {
    if (!this.schema) {
      throw new Error(`Forgot to validate in ${this.name}`);
    }
    const { error, value } = this.schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const errors = error.details.map((e) => e.message);
      return { errors, value: null };
    }
    return { errors: null, value };
  }
}

export default BaseDto;

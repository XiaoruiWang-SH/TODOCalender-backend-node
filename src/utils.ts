export function normalizePort(val: string): number {
  const port: number = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return port;
  }

  if (port >= 0) {
    // port number
    return port;
  }
  return 0;
}

export function log(message: string) {
  if (process.env.ENV === "dev") {
    console.log(message);
  }
}

export function isError(err: unknown): err is Error {
  return err instanceof Error;
}

const emailRegexp = /^.+@.+\..+$/;
const passwordRegexp = /^[a-zA-Z0-9]{6,12}$/;

export function validateRegisterBody(obj: any) {
  try {
    const isValidObj = new ObjValidationTool(obj)
      .isEmpty()
      .isValidPlainObj()
      .isValidForEmail()
      .isValidForName()
      .isValidForPassword()
      .isValidForReConfirmPassword()
      .done();
    return isValidObj;
  } catch (error) {
    throw error;
  }
}

export function validateLoginBody(obj: any) {
  try {
    const isValidObj = new ObjValidationTool(obj)
      .isEmpty()
      .isValidPlainObj()
      .isValidForEmail()
      .isValidForPassword()
      .done();
    return isValidObj;
  } catch (error) {
    throw error;
  }
}

class ObjValidationTool {
  obj: any;
  constructor(obj: any) {
    this.obj = obj;
  }

  isEmpty() {
    if (this.obj === null || this.obj === undefined) {
      throw new Error("the obj is empty");
    }
    return this;
  }

  isValidPlainObj() {
    if (
      !(this.obj instanceof Object) ||
      Object.prototype.toString.call(this.obj) !== "[object Object]"
    ) {
      throw new Error("the obj is not a plain object");
    }
    return this;
  }

  isValidForID() {
    if (!("id" in this.obj) || typeof this.obj.id !== "number") {
      throw new Error("id is not number type");
    }
    return this;
  }

  isValidForName() {
    if (!("name" in this.obj) || typeof this.obj.name !== "string") {
      throw new Error("id is not sring type");
    }
    return this;
  }

  isValidForEmail() {
    if (!("email" in this.obj) || typeof this.obj.email !== "string") {
      throw new Error("email is not sring type");
    }
    if (!emailRegexp.test(this.obj.email)) {
      throw new Error("email is not a valid format");
    }
    return this;
  }

  isValidForPassword() {
    if (!("password" in this.obj) || typeof this.obj.password !== "string") {
      throw new Error("password is not sring type");
    }
    if (!passwordRegexp.test(this.obj.password)) {
      throw new Error(
        "password need to meet the rule: 6 to 12 numbers or letters"
      );
    }
    return this;
  }

  isValidForReConfirmPassword() {
    if (
      !("reConfirmPassword" in this.obj) ||
      typeof this.obj.reConfirmPassword !== "string"
    ) {
      throw new Error("password is not sring type");
    }
    if (this.obj.password !== this.obj.reConfirmPassword) {
      throw new Error("reConfirmPassword is not equal to password");
    }
    return this;
  }

  isValidForRole() {
    if (!("role" in this.obj) || typeof this.obj.role !== "string") {
      throw new Error("role is not sring type");
    }
    return this;
  }

  isValidForProvider() {
    if (!("provider" in this.obj) || typeof this.obj.provider !== "string") {
      throw new Error("provider is not sring type");
    }
    return this;
  }

  isValidForProviderId() {
    if (
      !("providerId" in this.obj) ||
      typeof this.obj.providerId !== "string"
    ) {
      throw new Error("providerId is not sring type");
    }
    return this;
  }

  done() {
    return true;
  }
}

export interface MyResponse {
  result: boolean;
  message: string;
  data: { [key: string]: any };
}

export function formatRes(
  successful: boolean,
  message: string | null,
  content: { [key: string]: any } | null
): MyResponse {
  return {
    result: successful,
    message: message || "",
    data: content || {},
  };
}

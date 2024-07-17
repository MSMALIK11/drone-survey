export function validateName(name) {
  const pattern = /^[A-Za-z0-9+=,.@_\s-]+$/;
    return pattern.test(name);
  }
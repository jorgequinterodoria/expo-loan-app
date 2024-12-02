export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  return phoneRegex.test(phone);
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 3;
};

export const validateAddress = (address: string): boolean => {
  return address.trim().length >= 5;
};

export const formatPhoneNumber = (phone: string): string => {
  return phone.replace(/\D/g, '')
    .replace(/(\d{2})(\d{4})(\d{4})/, '+$1 $2-$3');
};
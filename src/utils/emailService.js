// Este é um serviço de e-mail simulado
export const sendEmail = (to, subject, body) => {
  console.log(`Enviando e-mail para ${to}`);
  console.log(`Assunto: ${subject}`);
  console.log(`Corpo: ${body}`);
  // Aqui você implementaria a lógica real de envio de e-mail
  return Promise.resolve({ success: true });
};
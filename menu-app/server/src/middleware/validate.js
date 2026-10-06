// Zod sxemi ilə req.body yoxlanır, təmizlənmiş dəyər req.body-yə yazılır.
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: 'Məlumatlar yanlışdır',
      errors: result.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
    });
  }
  req.body = result.data;
  next();
};

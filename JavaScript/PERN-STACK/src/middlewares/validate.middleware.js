export const validateSchema = (schema) => async (req, res, next) => {
    try {
        await schema.parse(req.body);
        next();
    } catch (error) {
        console.log(error)
        if (Array.isArray(error.issues)) {
            return res.status(400).json(error.issues.map((issue) => issue.message));
        }
    }
};
/**
 * Documentação OpenAPI da rota de status/health check.
 */

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Verifica se a API está em execução
 *     tags: [Status]
 *     responses:
 *       200:
 *         description: API está saudável
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: 'OK' }
 *                 timestamp: { type: string, format: date-time }
 */
import request from 'supertest';
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import YAML from 'yaml';
import authRoutes from '../../src/routes/auth.routes';
import notesRoutes from '../../src/routes/notes.routes';
import { verifyToken } from '../../src/middleware/auth.middleware';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/notes', verifyToken, notesRoutes);



const openApiPath = path.join(__dirname,'../../src/api/apenapi.yaml');
const openApiContent = fs.readFileSync(openApiPath, 'utf8');
const openApiSpec = YAML.parse(openApiContent);

const ajv = new Ajv({strict: false, allErrors: true});
addFormats(ajv);

describe('API Contract Tests', () => {
    let token: string;
    let noteId: string;

    beforeAll(async () => {
        await request(app)
            .post('/auth/register')
            .send({
                email: 'contract@test.com',
                password: 'test123456'
            });
            
        const loginResponse = await request(app)
            .post('/auth/login')
            .send({
                email: 'contract@test.com',
                password: 'test123456'
            });
            
        token = loginResponse.body.token;
    });

    describe('Auth Endpoints', () => {
        test('POST /auth/register - response matches OpenAPI schema', async () => {
            const response = await request(app)
                .post('/auth/register')
                .send({
                    email: 'contract2@test.com',
                    password: 'test123456'
                });
                
            const schema = openApiSpec.components.schemas.User;
            const validate = ajv.compile(schema);
            const isValid = validate(response.body);
            
            expect(response.status).toBe(201);
            if (!isValid) {
                console.error('Validation errors:', validate.errors);
            }
            expect(isValid).toBe(true);
        });

        test('POST /auth/login - response matches OpenAPI schema', async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({
                    email: 'contract@test.com',
                    password: 'test123456'
                });
                
            const schema = openApiSpec.components.schemas.LoginResponse;
            const validate = ajv.compile(schema);
            const isValid = validate(response.body);
            
            expect(response.status).toBe(200);
            if (!isValid) {
                console.error('Validation errors:', validate.errors);
            }
            expect(isValid).toBe(true);
        });
    });

    describe('Notes Endpoints', () => {
        test('POST /notes - response matches OpenAPI schema', async () => {
            const response = await request(app)
                .post('/notes')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Contract Test Note',
                    content: '# Contract Test Content'
                });
                
            const schema = openApiSpec.components.schemas.Note;
            const validate = ajv.compile(schema);
            const isValid = validate(response.body);
            
            noteId = response.body.id;
            
            expect(response.status).toBe(201);
            if (!isValid) {
                console.error('Validation errors:', validate.errors);
            }
            expect(isValid).toBe(true);
        });

        test('GET /notes - response matches OpenAPI schema', async () => {
            const response = await request(app)
                .get('/notes')
                .set('Authorization', `Bearer ${token}`);
                
            const noteSchema = openApiSpec.components.schemas.Note;
            const arraySchema = {
                type: 'array',
                items: noteSchema
            };
            
            const validate = ajv.compile(arraySchema);
            const isValid = validate(response.body);
            
            expect(response.status).toBe(200);
            if (!isValid) {
                console.error('Validation errors:', validate.errors);
            }
            expect(isValid).toBe(true);
        });

        test('GET /notes/:id - response matches OpenAPI schema', async () => {
            const response = await request(app)
                .get(`/notes/${noteId}`)
                .set('Authorization', `Bearer ${token}`);
                
            const schema = openApiSpec.components.schemas.Note;
            const validate = ajv.compile(schema);
            const isValid = validate(response.body);
            
            expect(response.status).toBe(200);
            if (!isValid) {
                console.error('Validation errors:', validate.errors);
            }
            expect(isValid).toBe(true);
        });

        test('PUT /notes/:id - response matches OpenAPI schema', async () => {
            const response = await request(app)
                .put(`/notes/${noteId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Updated Contract Note',
                    content: '## Updated Contract Content'
                });
                
            const schema = openApiSpec.components.schemas.Note;
            const validate = ajv.compile(schema);
            const isValid = validate(response.body);
            
            expect(response.status).toBe(200);
            if (!isValid) {
                console.error('Validation errors:', validate.errors);
            }
            expect(isValid).toBe(true);
        });

        test('GET /notes/:id/html - returns HTML content with correct headers', async () => {
            const response = await request(app)
                .get(`/notes/${noteId}/html`)
                .set('Authorization', `Bearer ${token}`);
                
            expect(response.status).toBe(200);
            expect(response.type).toBe('text/html');
            expect(typeof response.text).toBe('string');
        });

        test('Error responses match OpenAPI schema', async () => {
            const response = await request(app)
                .get('/notes/nonexistent-id')
                .set('Authorization', `Bearer ${token}`);
                
            const schema = openApiSpec.components.schemas.Error;
            const validate = ajv.compile(schema);
            const isValid = validate(response.body);
            
            expect(response.status).toBe(404);
            if (!isValid) {
                console.error('Validation errors:', validate.errors);
            }
            expect(isValid).toBe(true);
        });
    });
});

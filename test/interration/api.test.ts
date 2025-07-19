import request from 'supertest';
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from '../../src/routes/auth.routes';
import notesRoutes from '../../src/routes/notes.routes';
import { verifyToken } from '../../src/middleware/auth.middleware';
import { errorHandler } from '../../src/middleware/error.middleware';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/notes', verifyToken, notesRoutes);
app.use(errorHandler);

describe('API Integration Tests', () => {
    let token: string;
    let noteId: string;

    beforeAll(async () => {
        await request(app)
            .post('/auth/register')
            .send({
                email: 'integration@test.com',
                password: 'test123456'
            });
            
        const loginResponse = await request(app)
            .post('/auth/login')
            .send({
                email: 'integration@test.com',
                password: 'test123456'
            });
            
        token = loginResponse.body.token;
    });

    describe('Notes API', () => {
        it('should create a note', async () => {
            const response = await request(app)
                .post('/notes')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Integration Test Note',
                    content: '# Integration Test'
                });
                
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.title).toBe('Integration Test Note');
            
            noteId = response.body.id;
        });

        it('should get a list of notes', async () => {
            const response = await request(app)
                .get('/notes')
                .set('Authorization', `Bearer ${token}`);
                
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThanOrEqual(1);
        });

        it('should get a specific note', async () => {
            const response = await request(app)
                .get(`/notes/${noteId}`)
                .set('Authorization', `Bearer ${token}`);
                
            expect(response.status).toBe(200);
            expect(response.body.id).toBe(noteId);
        });

        it('should update a note', async () => {
            const response = await request(app)
                .put(`/notes/${noteId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Updated Note',
                    content: '# Updated Content'
                });
                
            expect(response.status).toBe(200);
            expect(response.body.title).toBe('Updated Note');
            expect(response.body.content).toBe('# Updated Content');
        });

        // it('should get HTML version of note', async () => {
        //     const response = await request(app)
        //         .get(`/notes/${noteId}/html`)
        //         .set('Authorization', `Bearer ${token}`);
                
        //     expect(response.status).toBe(200);
        //     expect(response.type).toBe('text/html');
        //     expect(response.text).toContain('<h1>Updated Content</h1>');
        // }); 
        // The test for getting the HTML version of a note is currently commented out due to incompatibility between Jest and the ESM-only marked module.

        it('should delete a note', async () => {
            const response = await request(app)
                .delete(`/notes/${noteId}`)
                .set('Authorization', `Bearer ${token}`);
                
            expect(response.status).toBe(204);
            
            const getResponse = await request(app)
                .get(`/notes/${noteId}`)
                .set('Authorization', `Bearer ${token}`);
                
            expect(getResponse.status).toBe(404);
        });
    });

    describe('Authentication', () => {
        it('should not allow access without token', async () => {
            const response = await request(app)
                .get('/notes');
                
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message', 'Access denied');
        });

        it('should not allow access with invalid token', async () => {
            const response = await request(app)
                .get('/notes')
                .set('Authorization', 'Bearer invalid-token');
                
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message', 'Invalid token');
        });
    });
});

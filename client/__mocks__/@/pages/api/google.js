// __mocks__/@/pages/api/google.js
module.exports = {
    useGoogleHandler: jest.fn(() => {
        // Retorna una implementación mock de useGoogleHandler
        return {
            someFunction: jest.fn(),
            anotherFunction: jest.fn(),
        };
    }),
};

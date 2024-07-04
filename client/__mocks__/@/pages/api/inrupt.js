// __mocks__/@/pages/api/inrupt.js
module.exports = {
    useInruptHandler: jest.fn(() => {
        // Retorna una implementación mock de useInruptHandler
        return {
            someFunction: jest.fn(),
            anotherFunction: jest.fn(),
        };
    }),
};

import Code2Mind from '../src/core/Code2Mind';

describe('Code2Mind test', ()=>{
  test('Code2Mind parse', () => {
    const result = Code2Mind.parse(`1
2

  2-1
    2-1-1
3
4
  4-1
5
  5-1
 6`);
    expect(result).toEqual(
      expect.objectContaining({
        children: [
          {
            children: [
              {
                children: [
                  {
                    children: [],
                    level: 3,
                    parentUid: expect.any(String),
                    uid: expect.any(String),
                    title: '2-1-1'
                  }
                ],
                level: 2,
                parentUid: expect.any(String),
                uid: expect.any(String),
                title: '2-1'
              }
            ],
            level: 1,
            parentUid: expect.any(String),
            uid: expect.any(String),
            title: '2'
          },
          {
            children: [],
            level: 1,
            parentUid: expect.any(String),
            uid: expect.any(String),
            title: '3'
          },
          {
            children: [
              {
                children: [],
                level: 2,
                parentUid: expect.any(String),
                uid: expect.any(String),
                title: '4-1'
              }
            ],
            level: 1,
            parentUid: expect.any(String),
            uid: expect.any(String),
            title: '4'
          },
          {
            children: [
              {
                children: [],
                level: 2,
                parentUid: expect.any(String),
                uid: expect.any(String),
                title: '5-1'
              }
            ],
            level: 1,
            parentUid: expect.any(String),
            uid: expect.any(String),
            title: '5'
          },
          {
            children: [],
            level: 1,
            parentUid: expect.any(String),
            uid: expect.any(String),
            title: '6'
          }
        ],
        level: 0,
        parentUid: null,
        uid: expect.any(String),
        title: '1'
      }));
  });
  test('Code2Mind parse null', () => {
    const result = Code2Mind.parse('');
    expect(result).toEqual(null);
  });
});


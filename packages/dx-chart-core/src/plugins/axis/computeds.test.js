import { axisCoordinates, getGridCoordinates, axesData } from './computeds';

jest.mock('../../utils/scale', () => ({
  fixOffset: scale => value => scale(value) + 15,
}));

describe('axisCoordinates', () => {
  const tickSize = 5;
  const indentFromAxis = 10;

  afterEach(jest.clearAllMocks);

  describe('linear', () => {
    const scale = jest.fn().mockReturnValue(10);
    scale.ticks = jest.fn().mockReturnValue([1]);

    it('should return ticks Coordinates with horizontal-top position', () => {
      const coordinates = axisCoordinates({
        name: 'argument-domain', scale, position: 'top', tickSize, indentFromAxis,
      });
      expect(coordinates).toEqual({
        sides: [1, 0],
        ticks: [{
          key: '0', xText: 25, yText: -10, text: 1, dominantBaseline: 'baseline', textAnchor: 'middle', y1: 0, y2: -5, x1: 25, x2: 25,
        }],
      });
    });

    it('should return ticks coordinates with horizontal-bottom position', () => {
      const coordinates = axisCoordinates({
        name: 'argument-domain', scale, position: 'bottom', tickSize, indentFromAxis,
      });
      expect(coordinates).toEqual({
        sides: [1, 0],
        ticks: [{
          key: '0', xText: 25, yText: 10, text: 1, dominantBaseline: 'hanging', textAnchor: 'middle', y1: 0, y2: 5, x1: 25, x2: 25,
        }],
      });
    });

    it('should pass correct domain to scale, horizontal', () => {
      axisCoordinates({
        name: 'argument-domain', scale, position: 'top', tickSize,
      });
      expect(scale.mock.calls).toEqual([
        [1],
      ]);
    });

    it('should return ticks coordinates with vertical-left position', () => {
      const coordinates = axisCoordinates({
        name: 'value-domain', scale, position: 'left', tickSize, indentFromAxis,
      });
      expect(coordinates).toEqual({
        sides: [0, 1],
        ticks: [{
          key: '0', text: 1, xText: -10, yText: 25, x1: 0, x2: -5, y1: 25, y2: 25, dominantBaseline: 'middle', textAnchor: 'end',
        }],
      });
    });

    it('should return ticks coordinates with vertical-right position', () => {
      const coordinates = axisCoordinates({
        name: 'value-domain', scale, position: 'right', tickSize, indentFromAxis,
      });
      expect(coordinates).toEqual({
        sides: [0, 1],
        ticks: [{
          key: '0', text: 1, xText: 10, yText: 25, x1: 0, x2: 5, y1: 25, y2: 25, dominantBaseline: 'middle', textAnchor: 'start',
        }],
      });
    });

    it('should pass correct domain to scale, vertical', () => {
      axisCoordinates({
        name: 'value-domain', scale, position: 'left', tickSize,
      });
      expect(scale.mock.calls).toEqual([
        [1],
      ]);
    });

    it('should format ticks', () => {
      scale.tickFormat = jest.fn(() => tick => `format ${tick}`);
      try {
        const coordinates = axisCoordinates({
          name: 'argument-domain', scale, position: 'top', tickSize, indentFromAxis,
        });
        expect(coordinates.ticks).toEqual([{
          key: '0', xText: 25, yText: -10, text: 'format 1', dominantBaseline: 'baseline', textAnchor: 'middle', y1: 0, y2: -5, x1: 25, x2: 25,
        }]);
      } finally {
        delete scale.tickFormat;
      }
    });

    it('should format ticks, user set format', () => {
      scale.tickFormat = jest.fn(() => tick => `format ${tick}`);
      const userFormat = jest.fn(() => tick => `user format ${tick}`);
      try {
        const coordinates = axisCoordinates({
          name: 'argument-domain', scale, tickFormat: userFormat, position: 'top', tickSize, indentFromAxis,
        });
        expect(coordinates.ticks).toEqual([{
          key: '0', xText: 25, yText: -10, text: 'user format 1', dominantBaseline: 'baseline', textAnchor: 'middle', y1: 0, y2: -5, x1: 25, x2: 25,
        }]);
      } finally {
        delete scale.tickFormat;
      }
    });
  });

  describe('band', () => {
    const scale = jest.fn().mockReturnValue(10);
    scale.domain = jest.fn().mockReturnValue(['a']);

    it('should pass correct domain to scale', () => {
      axisCoordinates({
        name: 'value-domain', scale, position: 'left', tickSize,
      });
      expect(scale.mock.calls).toEqual([
        ['a'],
      ]);
    });

    it('should return ticks coordinates with horizontal-bottom position', () => {
      const coordinates = axisCoordinates({
        name: 'argument-domain', scale, position: 'bottom', tickSize, indentFromAxis,
      });
      expect(coordinates).toEqual({
        sides: [1, 0],
        ticks: [{
          key: '0', xText: 25, yText: 10, text: 'a', dominantBaseline: 'hanging', textAnchor: 'middle', y1: 0, y2: 5, x1: 25, x2: 25,
        }],
      });
    });

    it('should return ticks Coordinates with horizontal-top position', () => {
      const coordinates = axisCoordinates({
        name: 'argument-domain', scale, position: 'top', tickSize, indentFromAxis,
      });
      expect(coordinates).toEqual({
        sides: [1, 0],
        ticks: [{
          key: '0', xText: 25, yText: -10, text: 'a', dominantBaseline: 'baseline', textAnchor: 'middle', y1: 0, y2: -5, x1: 25, x2: 25,
        }],
      });
    });

    it('should return ticks coordinates with vertical-left position', () => {
      const coordinates = axisCoordinates({
        name: 'value-domain', scale, position: 'left', tickSize, indentFromAxis,
      });
      expect(coordinates).toEqual({
        sides: [0, 1],
        ticks: [{
          key: '0', text: 'a', xText: -10, yText: 25, x1: 0, x2: -5, y1: 25, y2: 25, dominantBaseline: 'middle', textAnchor: 'end',
        }],
      });
    });

    it('should return ticks coordinates with vertical-right position', () => {
      const coordinates = axisCoordinates({
        name: 'value-domain', scale, position: 'right', tickSize, indentFromAxis,
      });
      expect(coordinates).toEqual({
        sides: [0, 1],
        ticks: [{
          key: '0', text: 'a', xText: 10, yText: 25, x1: 0, x2: 5, y1: 25, y2: 25, dominantBaseline: 'middle', textAnchor: 'start',
        }],
      });
    });
  });
});

describe('getGridCoordinates', () => {
  const scale = jest.fn(x => x + 1);
  scale.ticks = jest.fn().mockReturnValue([10, 20, 30, 40]);

  it('should return horizontal coordinates', () => {
    expect(getGridCoordinates({ name: 'argument-domain', scale })).toEqual([
      {
        key: '0', x: 26, y: 0, dx: 0, dy: 1,
      },
      {
        key: '1', x: 36, y: 0, dx: 0, dy: 1,
      },
      {
        key: '2', x: 46, y: 0, dx: 0, dy: 1,
      },
      {
        key: '3', x: 56, y: 0, dx: 0, dy: 1,
      },
    ]);
  });

  it('should return vertical coordinates', () => {
    expect(getGridCoordinates({ name: 'value-domain', scale })).toEqual([
      {
        key: '0', x: 0, y: 26, dx: 1, dy: 0,
      },
      {
        key: '1', x: 0, y: 36, dx: 1, dy: 0,
      },
      {
        key: '2', x: 0, y: 46, dx: 1, dy: 0,
      },
      {
        key: '3', x: 0, y: 56, dx: 1, dy: 0,
      },
    ]);
  });
});

describe('axesData', () => {
  it('should return array with props', () => {
    const axes = axesData([], { first: true });
    expect(axes).toEqual([{ first: true }]);
  });

  it('should push new axis props', () => {
    const axes = axesData([{ first: true }], { second: true });
    expect(axes).toEqual([{ first: true }, { second: true }]);
  });
});

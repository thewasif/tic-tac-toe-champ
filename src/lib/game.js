export class GameBoard {
  constructor(player_one, player_two) {
    this.PLAYER_ONE = player_one;
    this.PLAYER_TWO = player_two;
    this.turn = this.PLAYER_ONE;
  }

  board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  static winner = null;
  draw = false;
  PLAYER_ONE = null;
  PLAYER_TWO = null;

  get turn() {
    return this._turn;
  }

  set turn(value) {
    this._turn = value;
  }

  prettyBoard() {
    const { board } = this;

    return [
      [board[0], board[1], board[2]],
      [board[3], board[4], board[5]],
      [board[6], board[7], board[8]],
    ];
  }

  mark(position) {
    if (this.winner || this.draw) throw Error('Game has been ended!');

    const mark = this.turn === this.PLAYER_ONE ? 'x' : 'o';

    if (!this.board[position - 1]) this.board[position - 1] = mark;
    else throw new Error('Location already marked!');

    if (!this.board.includes(0)) {
      this.draw = true;
    }

    this.checkWinner();

    this.turn =
      this.turn === this.PLAYER_ONE
        ? (this.turn = this.PLAYER_TWO)
        : (this.turn = this.PLAYER_ONE);

    return this.board;
  }

  checkWinner() {
    const winner_states = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 4, 8],
      [2, 4, 6],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
    ];

    for (let e of winner_states) {
      const condition = e;
      const { board } = this;
      const a = board[condition[0]];
      const b = board[condition[1]];
      const c = board[condition[2]];
      if (a && b && c) {
        if (a === b && b === c) {
          console.log(
            `%c ${this.turn} wins!!!`,
            'background-color: #333; color: red;'
          );

          this.winner = this.turn;
        }
      }
    }
  }
}

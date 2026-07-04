class DuplicateBudgetError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DuplicateBudgetError';
  }
}

module.exports = { DuplicateBudgetError };

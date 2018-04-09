/**
 * Build a middleware that will understand DataTable query.
 *
 * @param {function({ start: number, length: number, sortOptions?: { fieldName: string, isAscending: boolean }, additionalOptions: any}): Promise<{ totalCount: number, filteredCount: number, data: any[] }> } dataBuilder a data builder function
 * @return an Express's RequestHandler.
 */
exports.buildDataTableEndpoint = (dataBuilder) => {
  return (req, res) => {
    const options = req.query;

    const start = Number(options.start);
    const length = Number(options.length);

    let sortOptions = undefined;
    if (options.order.length > 0) {
      const sorter = options.order[0];

      const sortFieldIndex = sorter.column;
      const isAscending = sorter.dir === 'asc';
      const fieldName = options.columns[sortFieldIndex].data;

      sortOptions = { fieldName, isAscending };
    };

    const additionalOptions = options.additionalOptions;

    dataBuilder({ start, length, sortOptions, additionalOptions }).then((result) => {
      const { totalCount, filteredCount, data } = result;

      res.json({
        draw: Number(req.query.draw),
        recordsTotal: totalCount,
        recordsFiltered: filteredCount,
        data: data
      });
    });
  };
};

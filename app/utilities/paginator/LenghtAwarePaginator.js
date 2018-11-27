class LengthAwarePaginator {

    /**
     *
     * @param  {Object} data
     * @param  {Number} total
     * @param  {Number} per_page
     * @param  {Number} current_page
     * @return {mixed}
     */
    constructor(req, data, total, current_page = null, per_page = null) {
        this.req = req;
        this.data = data;
        this.total = parseInt(total);
        this.per_page = parseInt(per_page) || App.helpers.getComputedPaginationLimit(req.getParam('limit'));
        this.current_page = current_page || this.req.getParam('page', 1);
        if(App.lodash.isEmpty(this.current_page)) {
            this.current_page = 1;
        }
    }

    getJSON() {
        return {
            data: this.data,
            total: this.total,
            count: this.data.length,
            per_page: this.per_page,
            current_page: parseInt(this.current_page),
            total_pages: (this.total) ? 
                ((this.per_page > 1) ?
                    Math.floor(this.total / this.per_page) + 1 :
                    Math.floor(this.total / this.per_page))
                :
                0,
        };
    }

}

module.exports = LengthAwarePaginator;

(function () {
	var fdb = new ForerunnerDB(),
		db = fdb.db(),
		coll = db.collection('testList'),
		view = db.view('testList'),
		data = [],
		i;

	console.time('Create');
	for (i = 0; i < 1213; i++) {
		data.push({
			_id: i,
			variable: 'Item ' + i
		});
	}

	coll.insert(data, function () {
		console.timeEnd('Create');

		view.transform({
			enabled: true,
			dataIn: function (data) {
				return {
					_id: data._id,
					name: data.variable
				};
			}
		});

		console.time('View Data From');
		view.from(coll, function () {
			console.log('from worked');
			console.log('from after', view.find());
		});
		console.log('from before', view.find());

		console.timeEnd('View Data From');

		console.time('Infinilist');
		console.profile('Infinilist');

		view.infinilist('#testContainer', '#listItem', {
			infinilist: {
				itemHeight: 24,
				countQuery: {}
			}
		});
		console.profileEnd('Infinilist');
		console.timeEnd('Infinilist');

		// Test scrollToQuery()
		console.log('Testing scrolling to specific items...');
		setTimeout(function () {
			view.infinilist('#testContainer').scrollToQuery({
				_id: 600
			}, {
				$incItem: -3
			}, function () {
				setTimeout(function () {
					"use strict";
					console.log('Callback worked 1');
					view.infinilist('#testContainer').scrollToQuery({
						_id: 200
					}, {
						$incItem: 0
					}, function () {
						console.log('Callback worked 2');

					});
				}, 1000);
			});
		}, 1000);
	});
})();
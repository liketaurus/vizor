(function() {

var prevGraph

var LoadGraph = E2.plugins['load_graph'] = function(core, node) {
	this.desc = 'Instructs the player to play the graph (replacing the current graph) when enabled'

	this.input_slots = [{
			name: 'back key', dt: core.datatypes.FLOAT,
			desc: 'If set, pressing this key will load the previous graph (space=32)',
			def: null
		}, {
			name: 'graph', dt: core.datatypes.OBJECT,
			desc: 'Graph to play', def: null
		}]
	
	this._keyCode = this._graph = null
	this.output_slots = []
}

LoadGraph.prototype.update_input = function(slot, data) {
	var that = this

	function goToGraph() {
		if (!prevGraph) {
			prevGraph = E2.app.player.core.serialise()
		}

		function onKeyPress(e) {
			if (e.keyCode !== that._keyCode)
				return;

			$(window).off('keypress', onKeyPress)

			E2.app.player.stop()
			E2.app.player.load_from_json(prevGraph)
			E2.app.player.play()
		}

		if (that._keyCode)
			$(window).on('keypress', onKeyPress)

		// play graph
		E2.app.player.stop()
		E2.app.player.load_from_object(that._graph)
		E2.app.player.play()
	}

	switch(slot.index) {
		case 0:
			this._keyCode = Math.floor(data)
			break;
		case 1:
			if (!data || !Object.keys(data).length)
				return;
			this._graph = data
			goToGraph()
			break;
	}
}

})()

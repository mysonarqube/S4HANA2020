/*
 * Copyright (C) 2009-2022 SAP SE or an SAP affiliate company. All rights reserved.
 */
/**
 * Initialization Code and shared classes of library cus.sd.lib.worklist.
 */
sap.ui.define(['jquery.sap.global',
		'sap/ui/core/library'
	], // library dependency
	function(jQuery) {

		"use strict";

		/**
		 * SD Reuse Library for Worklist
		 *
		 * @namespace
		 * @name cus.sd.lib.worklist
		 * @author SAP SE
		 * @version 24.0.8
		 * @public
		 */

		// delegate further initialization of this library to the Core
		sap.ui.getCore().initLibrary({
			name: "cus.sd.lib.worklist",
			version: "24.0.8",
			dependencies: ["sap.ui.core"],
			types: [],
			interfaces: [],
			controls: [
				"cus.sd.lib.worklist.util.UtilityHelper"
			],
			elements: [],
			noLibraryCSS:true
		});

		return cus.sd.lib.worklist;

	}, /* bExport= */ false);

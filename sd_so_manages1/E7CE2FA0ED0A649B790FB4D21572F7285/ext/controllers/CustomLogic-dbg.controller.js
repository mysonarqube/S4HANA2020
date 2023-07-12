/*
 * Copyright (C) 2009-2022 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.require("sap.ui.model.FilterOperator");

sap.ui.define([
	"cus/sd/lib/worklist/util/UtilityHelper/"
], function (UtilityHelper) {
	"use strict";

	return sap.ui.controller("cus.sd.salesorders.manage.ext.controllers.CustomLogic", {

		targetObj: [{
			semanticObject: "SalesOrder",
			createSemanticAction: "create"
		}, {
			semanticObject: "SalesOrder",
			manageSemanticAction: "manageSalesOrderV2"
		}],

		ctrlConfig: {
			keyPO: "PurchaseOrderByCustomer"
		},

		businessObject: {
			documentTyp: "SalesOrder",
			processFlowDocument: "salesOrder"
		},

		aSmartCtrlConfig: [{
			keyDate: "RequestedDeliveryDate"
		}, {
			keyDate: "SalesOrderDate"
		}, {
			keyDate: "CreationDate"
		}, {
			keyDate: "LastChangeDate"
		}],

		i18nPath: "i18n|sap.suite.ui.generic.template.ListReport|C_SalesOrderWl_F1873",

		util: new UtilityHelper(),

		onInitSmartFilterBarExtension: function (oEvent) {
			var oSmartFilterBar = oEvent.getSource();
			this.util.onInitSetDateDefault(oSmartFilterBar, this.aSmartCtrlConfig);
			this._initi18nReuseLib.call(this);
		},

		handleKeyChange: function (oEvent) {
			return this.util.handleKeyChangeBase(oEvent);
		},

		onBeforeRebindTableExtension: function (oEvent) {
			var oBindingParams = oEvent.getParameter("bindingParams");
			var oSmartTable = oEvent.getSource();
			var oSmartFilterBar = this.byId(oSmartTable.getSmartFilterId());
			var fnGetControl = function (key) {
				return oSmartFilterBar.getControlByKey(key);
			};
			return this.util.onBeforeRebindTableExtensionBase(oBindingParams, oSmartFilterBar, this.ctrlConfig, fnGetControl);
		},

		getCustomAppStateDataExtension: function (oCustomData) {
			var customFilter = [{
				fieldName: "PurchaseOrderByCustomer",
				fieldObject: this.byId("PurchaseOrderByCustomerValue"),
				methodName: "getValue"
			}];
			return this.util.customAppStateDataExtensionBase(oCustomData, customFilter, this.util._fnGetValue);
		},

		restoreCustomAppStateDataExtension: function (oCustomData) {
			var customFilter = [{
				fieldName: "PurchaseOrderByCustomer",
				fieldObject: this.byId("PurchaseOrderByCustomerValue"),
				methodName: "setValue"
			}];
			return this.util.customAppStateDataExtensionBase(oCustomData, customFilter, this.util._fnRestoreValue);
		},

		onPressCreate: function (oEvent) {
			return this.util.onPressCreateBase.call(this, this.targetObj[0], this.getSalesOrderTypeFilter(oEvent));
		},

		onPressNewCreate: function () {
			var params = {
				preferredMode: "create"
			};
			return this.util.onPressManageBase.call(this, this.targetObj[1], params);
		},
		
		onPressCreateWithReference: function(oEvent) {
			var oButton = oEvent.getSource();
			var sButtonId = oButton.getId();
			
			if(sButtonId.includes("SalesQuotation")) {
				var oParameter = {
					preferredMode: "createWith:com.sap.gateway.srvd.c_salesordermanage_sd.v0001.CreateWithRefFromSlsQuotation"
				};
			}
			if(sButtonId.includes("SalesContract")) {
				oParameter = {
					preferredMode: "createWith:com.sap.gateway.srvd.c_salesordermanage_sd.v0001.CreateWithRefFromSlsContract"
				}; 
			}
			if (oParameter) {
				var navigateToExternal = this.util.onPressManageBase.call(this, this.targetObj[1], oParameter);	
			}
			
			return navigateToExternal; 
		},

		onRejectAllItems: function (oEvent) {
			var usecase = {
				idControl: "SalesDocumentRjcnReason"
			};
			this.actionI18NKey = "setSalesDocumentRjcnReason";
			var oTable = oEvent.getSource().getParent().getParent();
			
			var fnRemoveSelection = function () {
				oTable.removeSelections();
			};
			var aUpdateContext = this.util.getUpdateContextListReportTable(this.extensionAPI);
			
			return this.util.onActionWithInputMassChange(this, aUpdateContext, this.extensionAPI, usecase, fnRemoveSelection);
		},
		
		onSetDeliveryBlock: function (oEvent) {
			var usecase = {
				idControl: "DeliveryBlockReason"
			};

			this.actionI18NKey = "setDeliveryBlockReason";
			var oTable = oEvent.getSource().getParent().getParent();

			var fnRemoveSelection = function () {
				oTable.removeSelections();
			};
			var aUpdateContext = this.util.getUpdateContextListReportTable(this.extensionAPI);

			return this.util.onActionWithInputMassChange(this, aUpdateContext, this.extensionAPI, usecase, fnRemoveSelection);
		},

		onRemoveDeliveryBlock: function (oEvent) {
			var usecase = {
				idControl: "DeliveryBlockReason"
			};

			this.actionI18NKey = "removeDeliveryBlockReason";

			var oTable = oEvent.getSource().getParent().getParent();

			var fnRemoveSelection = function () {
				oTable.removeSelections();
			};
			var aUpdateContext = this.util.getUpdateContextListReportTable(this.extensionAPI);

			return this.util.onActionWithoutInputMassChange(this, aUpdateContext, this.extensionAPI, usecase, fnRemoveSelection);
		},

		onSetBillingBlock: function (oEvent) {
			var usecase = {
				idControl: "HeaderBillingBlockReason"
			};

			this.actionI18NKey = "setHeaderBillingBlockReason";
			var oTable = oEvent.getSource().getParent().getParent();

			var fnRemoveSelection = function () {
				oTable.removeSelections();
			};
			var aUpdateContext = this.util.getUpdateContextListReportTable(this.extensionAPI);

			return this.util.onActionWithInputMassChange(this, aUpdateContext, this.extensionAPI, usecase, fnRemoveSelection);
		},

		onRemoveBillingBlock: function (oEvent) {
			var usecase = {
				idControl: "HeaderBillingBlockReason"
			};

			this.actionI18NKey = "removeHeaderBillingBlockReason";
			var oTable = oEvent.getSource().getParent().getParent();

			var fnRemoveSelection = function () {
				oTable.removeSelections();
			};
			var aUpdateContext = this.util.getUpdateContextListReportTable(this.extensionAPI);

			return this.util.onActionWithoutInputMassChange(this, aUpdateContext, this.extensionAPI, usecase, fnRemoveSelection);
		},

		onPressOverallStatus: function (oEvent) {
			var that = this;
			var fragPath = "cus.sd.salesorders.manage.ext.fragments.Processflow";
			var owner = this.getOwnerComponent();

			function fnOpenProcFlow() {
				that.util.onPressOverallStatus.call(that, oEvent, fragPath, that.businessObject);
			}
			return owner.runAsOwner(fnOpenProcFlow);
		},

		_initi18nReuseLib: function () {
			this.util.initi18nReuseLib.call(this);
		},

		getSalesOrderTypeFilter: function (oEvent) {
			var param;
			var oTable = oEvent.getSource().getParent().getParent();
			var oBinding = oTable.getBinding("items");
			if (oBinding) {
				var oCombFilter = oBinding.oCombinedFilter;
				if (oCombFilter) {
					var aFilters = oCombFilter.aFilters;
					if (aFilters) {
						param = this._getSalesOrderTypeFilter(aFilters);
					}
				}
			}
			return param;
		},

		_getSalesOrderTypeFilter: function (aFilters) {
			var param;
			for (var i = 0; i < aFilters.length; i++) {
				if (aFilters[i].sPath) {
					if (aFilters[i].sPath === "SalesOrderType") {
						param = {
							SalesOrderType: aFilters[i].oValue1
						};
						break;
					}
				} else if (aFilters[i].aFilters) {
					param =	this._getSalesOrderTypeFilter(aFilters[i].aFilters);
				}
			}
			return param;
		}
	});
});
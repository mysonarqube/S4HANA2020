/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"i2d/mpe/workassign/manages1/ext/utils/Formatter",
	"sap/m/MessageBox",
	"i2d/mpe/workassign/manages1/ext/fragment/ChangePriorityDialog",
	"i2d/mpe/workassign/manages1/ext/fragment/EditTimeForOADialog"
], function (Formatter, MessageBox, ChangePriorityDialog, EditTimeForOADialog) {

	return  sap.ui.controller("i2d.mpe.workassign.manages1.ext.controller.ListReportExtension", {
		formatter: Formatter,
	
		/**
		 * Extension method
		 */
		onInitSmartFilterBarExtension: function (oEvent) {
			var oSmartFilterBar = oEvent.getSource();
			if (oSmartFilterBar instanceof sap.ui.comp.smartfilterbar.SmartFilterBar) {
				var currentDate = new Date();
				oSmartFilterBar.setFilterData({
					OpLtstSchedldExecStrtDte: {
						conditionTypeInfo: {
							calendarType: "Gregorian",
							key: "OpLtstSchedldExecStrtDte",
							operation: "TO",
							value1: currentDate,
							name: "sap.ui.comp.config.condition.DateRangeType"
						}
					}
				});
			}
		},
	
		onSelectionChange: function (oEvent) {
			this.handleMultiSelectionWithAllOption(oEvent);
		},
	
		handleMultiSelectionWithAllOption: function (oEvent) {
			var loSource = oEvent.getSource();
			var sSelectedKey = oEvent.getParameter("changedItem").getProperty("key");
			var aSelectedKeys = loSource.getProperty("selectedKeys");
			if (sSelectedKey && (sSelectedKey === "0") && (oEvent.getParameter("selected"))) {
				//Select All
				loSource.setSelectedItems(loSource.getItems());
			} else if (sSelectedKey && (sSelectedKey === "0") && (!oEvent.getParameter("selected"))) {
				// UnSelect All
				loSource.setSelectedItems([]);
			} else {
				if (aSelectedKeys.indexOf("0") !== -1) {
					//If user select All and then deselect Any of the options apart from 'All', then Deselect 'All' option
					aSelectedKeys.splice(aSelectedKeys.indexOf("0"), 1);
					loSource.setSelectedKeys(aSelectedKeys);
				} else {
					var iNoOfItems = loSource.getItems().length;
					var iNoOfSelectedItems = aSelectedKeys.length;
					var iDelta = iNoOfItems - iNoOfSelectedItems;
					if (iDelta === 1) {
						//if User Selects All the Options apart from the 'All', then select all options
						loSource.setSelectedItems(loSource.getItems());
					}
				}
			}
		},
	
		onBeforeRebindTableExtension: function (oEvent) {
			var oBindingParams = oEvent.getParameter("bindingParams");
			oBindingParams.parameters = oBindingParams.parameters || {};
			var oSmartTable = oEvent.getSource();
			var oSmartFilterBar = this.byId(oSmartTable.getSmartFilterId());
			var vCategories;
			var vNumberOfCategories;
			if (oSmartFilterBar instanceof sap.ui.comp.smartfilterbar.SmartFilterBar) {
				var oCustomControl = oSmartFilterBar.getControlByKey("OpActyNtwkSegmentType");
				if (oCustomControl instanceof sap.m.MultiComboBox) {
					vCategories = oCustomControl.getSelectedKeys();
					vNumberOfCategories = vCategories.length;
					for (var i = 0; i < vNumberOfCategories; i++) {
						switch (vCategories[i]) {
						case "0":
							break;
						case "1":
							oBindingParams.filters.push(new sap.ui.model.Filter("OpActyNtwkSegmentType", "EQ", "1"));
							break;
						case "2":
							oBindingParams.filters.push(new sap.ui.model.Filter("OpActyNtwkSegmentType", "EQ", "2"));
							break;
						case "3":
							oBindingParams.filters.push(new sap.ui.model.Filter("OpActyNtwkSegmentType", "EQ", "3"));
							break;
						}
					}
				}
			}
		},
	
		/**
		 * Event is fired when the user triggers the link of the Material Number link
		 * 
		 * It opens the Material Popover.
		 * @param {sap.ui.base.Event} oEvent - An Event object consisting of an ID, a source and a map of parameters.
		 */
		handleMaterialLinkPress: function (oEvent) {
			var that = this;
			var oOA = oEvent.getSource().getBindingContext().getObject();
			sap.ui.define('MaterialController', ['sap/i2d/mpe/lib/popovers1/fragments/MaterialController'], function (MaterialController) {
				if (!that.oMaterialPop) {
					that.oMaterialPop = new MaterialController();
				}
				that.oMaterialPop.openMaterialPopOver(oEvent, that, oOA.Material, oOA.ProductionPlant);
			});
		},
	
		/** 
		 * Handler for order link press, opens a popover which shows the details of the order
		 * @param oEvent
		 */
		handleOrderNumberLinkPress: function (oEvent) {
			var oSource = oEvent.getSource();
			var sPath = oSource.getBindingContext().sPath;
			var oProperty = oSource.getModel().getProperty(sPath);
			var sManufacturingOrderId = oProperty.ManufacturingOrder || oProperty.MRPElement;
			//this.oProductionOrderPop.openProdOrdPopOver(oEvent, this, sManufacturingOrderId);
			var that = this;
			sap.ui.define('ProductionOrderController', ['sap/i2d/mpe/lib/popovers1/fragments/ProductionOrderController'], function (
				ProductionOrderController) {
				if (!that.oProductionOrderPop) {
					that.oProductionOrderPop = new ProductionOrderController();
				}
				that.oProductionOrderPop.openProdOrdPopOver(oEvent, that, sManufacturingOrderId);
			});
		},
	
		/** 
		 * Handler for workcenter link press, opens a popover which shows the details of the workcenter
		 * @param oEvent
		 */
		handleWorkCenterLinkPress: function (oEvent) {
			var that = this;
			sap.ui.define('WorkCenterController', ['sap/i2d/mpe/lib/popovers1/fragments/WorkCenterController'], function (WorkCenterController) {
				if (!that.oWorkCenterPop) {
					that.oWorkCenterPop = new WorkCenterController();
				}
				that.oWorkCenterPop.openWorkCenterPopOver(oEvent, that);
			});
		},
	
		/**
		 * Fired when the user clicks or taps on the "Edit Target Time" Button above the table 
		 * @param {sap.ui.base.Event} oEvent - An Event object consisting of an ID, a source and a map of parameters.
		 */
		onEditTargetTime: function (oEvent) {
			EditTimeForOADialog._initAndOpenEditTimeForOADialog(this.getView(), this.extensionAPI.getSelectedContexts());
		},
	
		/**
		 * Fired when the user clicks or taps on the "Unassign" Button above the table 
		 * @param {sap.ui.base.Event} oEvent - An Event object consisting of an ID, a source and a map of parameters.  
		 */
		onUnassignAll: function (oEvent) {
	
			var api = this.extensionAPI;
			var oOperationActyContexts = api.getSelectedContexts();
			var that = this;
			var bShowSuccessToast = true;
			var sGroup = jQuery.sap.uid(); // create an id under which the batch call will be executed
			this.getView().getModel().setDeferredGroups([sGroup]);
	
			oOperationActyContexts.forEach(function (oOAContext, index, arr) {
				var oOA = oOAContext.getObject();
				that.getView().getModel().callFunction("/C_ProcgExecOpActyInstceTPUnassign", // function import name
					{
						groupId: sGroup,
						method: "POST", // http method
						urlParameters: {
							"OpActyNtwkInstance": oOA.OpActyNtwkInstance,
							"OpActyNtwkElement": oOA.OpActyNtwkElement
						}, // function import parameters
						success: function (oData, response) {
	
						}, // callback function for success
						error: function (oError) {
								//	jQuery.sap.log.error(oError.responseText);
								var sResponseText = oError.responseText;
								if (sResponseText !== undefined) {
									var oResponseJSON;
									try {
										oResponseJSON = JSON.parse(sResponseText);
										var sMsg = oResponseJSON.error.message.value;
										sap.ui.core.BusyIndicator.hide();
										if (!this._bMessageOpen) {
											this._bMessageOpen = true;
											sap.m.MessageBox.error(
												sMsg, {
													id: "backEndErrorMessageBoxUnassignAll",
													title: that.getView().getModel("i18n").getResourceBundle().getText("UnassignmentFailedMessage"),
													actions: [sap.m.MessageBox.Action.CLOSE],
													onClose: function () {
														this._bMessageOpen = false;
													}.bind(this)
												});
										}
									} catch (error) {
										sap.m.MessageToast.show(that.getView().getModel("i18n").getResourceBundle().getText("UnassignmentFailedMessage"));
									}
								}
								bShowSuccessToast = false;
							} // callback function for error
					}
				);
			});
	
			//Submits the collected changes | do the batch call
			this.getView().getModel().submitChanges({
				groupId: sGroup,
				success: function (oData) {
					if (bShowSuccessToast) {
						sap.m.MessageToast.show(that.getView().getModel("i18n").getResourceBundle().getText("UnAssignmentSuccessToast"));
					}
					that.getView().getModel().refresh(true);
				},
				error: function (oError) {
					that.getView().getModel().refresh(true);
					jQuery.sap.log.error(oError.responseText);
				}
			});
		},
	
		/**
		 * Fired when the user clicks or taps on the "Edit Assigned Operators" Button above the table 
		 * @param {sap.ui.base.Event} oEvent - An Event object consisting of an ID, a source and a map of parameters.  
		 */
		onEditAssignedOperators: function (oEvent) {
			sap.m.MessageBox.alert(this.getView().getModel("i18n").getResourceBundle().getText("EditAssignedOperatorsButton"));
		},
	
		/**
		 * Fired when the user clicks or taps on the "Assign Operator" Button above the table 
		 * @param {sap.ui.base.Event} oEvent - An Event object consisting of an ID, a source and a map of parameters.  
		 */
		onAssignOperators: function (oEvent) {
			this._initAssignOperatorDialog().open();
		},
		
		/**
		 * Fired when the user clicks or taps on the "Unassign Operator" Button above the table 
		 * @param {sap.ui.base.Event} oEvent - An Event object consisting of an ID, a source and a map of parameters.  
		 */
		onUnassignOperators: function (oEvent) {
			var api = this.extensionAPI;
			var oOperationActyContexts = api.getSelectedContexts();
	
			// Only one OA should be selected to unassign the operators otherwise an error message will appear
			if (oOperationActyContexts.length === 1) {
				this._initUnassignOperatorDialog().open();
			} 
			else {
				sap.m.MessageBox.error(this.getView().getModel("i18n").getResourceBundle().getText("UnassignOperatorsButtonErrorMessage"));		
			}
		},	

	
		/**
		 * @private
		 * Inits the AssignOperatorDialog and reads the necessary users that will be further processed (like removing dublicat users)
		 * @returns [{sap.m.Dialog}] returns the "_oAssignOperatorDialog" dialog object
		 */
		_initAssignOperatorDialog: function () {
			var that = this;
	
			// create upload dialog if not existing yet
			if (!this._oAssignOperatorDialog) {
				this._oAssignOperatorDialog = sap.ui.xmlfragment("i2d.mpe.workassign.manages1.ext.fragment.AssignOperatorDialog", this);
				this._oAssignOperatorDialog.setModel(this.getView().getModel("i18n"), "i18n");
				
				//fired after the dialog has been closed.
				this._oAssignOperatorDialog.attachAfterClose(function (oEvent) {
					if(that._oAssignOperatorDialog){
						//clear table data
						that._oAssignOperatorDialog.getModel().destroy();
						sap.ui.getCore().byId("assignOperatorDialog").destroy();
						that._oAssignOperatorDialog = undefined;
					}
				});
			}
			
			//set dialog to initial state
			sap.ui.getCore().byId("idSearchFieldOperatorDialog").setValue("");
			sap.ui.getCore().byId("changePriorityButton").setEnabled(false);
			sap.ui.getCore().byId("assignmentsTable").removeSelections(true);

			var api = this.extensionAPI;
			var oOAContexts = api.getSelectedContexts();
			this.getView().getModel().setUseBatch(true); //if this is not already done
			var oUserData = new sap.ui.model.json.JSONModel({
				"I_OpActyAllManufacturingUsers": []
			});
			
			var aFilters = [];
			var sGroup = jQuery.sap.uid(); // create an id under which the batch call will be executed
			this.getView().getModel().setDeferredGroups([sGroup]);
	
			oOAContexts.forEach(function (oOperationActyContext, index) {
				that._oAssignOperatorDialog.setBusy(true); //Control Busy Indicator
				that.getView().getModel().read(oOperationActyContext.sPath, {
					//	filters: aFilters,
					groupId: sGroup,
					urlParameters: {
						"$expand": "to_OpActyAllManufacturingUsers"
					},
					success: function (oData) {
						oUserData.getProperty("/I_OpActyAllManufacturingUsers").push.apply(oUserData.getProperty("/I_OpActyAllManufacturingUsers"),
							oData.to_OpActyAllManufacturingUsers.results);
					},
					error: function (oError) {
						jQuery.sap.log.error(oError.responseText);
					}
				});
			});
	
			//Submits the collected changes | do the batch call
			this.getView().getModel().submitChanges({
				groupId: sGroup,
				success: function (oData) {
					//removing dublicat users
					var lookupObject = {};
					//If we have several OAs selected we will get for each selected OA a set of Users. This means a User would appear several times in the list. 
					//So, we need to remove duplicates. At the end each relevant User shall appear only once in the list.
					//But we need to ensure that the remaining User-Items will contains all relevant information of selected OAs. 
					//This means e.g. that the returned set of Users marks a user as qualified, whereas returned set of Users for another OA marks the same user as not qualified. 
					//By removing users form the list the user must appears as qualified as the user corresponds to the requirements of at least on OA.
					for (var i in oUserData.getData().I_OpActyAllManufacturingUsers) {
						var currentToCheckUserData = lookupObject[oUserData.getData().I_OpActyAllManufacturingUsers[i].UserID];
						lookupObject[oUserData.getData().I_OpActyAllManufacturingUsers[i].UserID] = oUserData.getData().I_OpActyAllManufacturingUsers[i];
	
						//If the user already exist in the lookupObjecet we need to ensure that important informations of an user do not get lost if we relace them.
						if (currentToCheckUserData) {
							//We need to ensure if one of the Users is qualified to one of the selecte OAs that User will appear as qualified in the list.
							if (oUserData.getData().I_OpActyAllManufacturingUsers[i].UserIsQualified === false ||
								currentToCheckUserData.UserIsQualified === false) {
								lookupObject[oUserData.getData().I_OpActyAllManufacturingUsers[i].UserID].UserIsQualified = false;
							}
	
							//"UserIsOpActyMainWrkCtrMfgUser" identifies wether a Users default work center is the same workcenter of an OA.
							//As we can have multible OAs selectet we need to check if one of them fits to User defautl work center. 
							if (oUserData.getData().I_OpActyAllManufacturingUsers[i].UserIsOpActyMainWrkCtrMfgUser === true ||
								currentToCheckUserData.UserIsOpActyMainWrkCtrMfgUser === true) {
								lookupObject[oUserData.getData().I_OpActyAllManufacturingUsers[i].UserID].UserIsOpActyMainWrkCtrMfgUser = true;
							}
						}
					}
	
					oUserData.getData().I_OpActyAllManufacturingUsers = [];
					for (i in lookupObject) {
						oUserData.getData().I_OpActyAllManufacturingUsers.push(lookupObject[i]);
					}
	
					that._oAssignOperatorDialog.setModel(oUserData);
					that._oAssignOperatorDialog.setBusy(false);
					//that.getView().getModel().refresh(true); refresh not recommended, because it leads to performance issue 
	
					//Apply a filter on the remaining User.
					var oAssignOperatorDialogTable = sap.ui.getCore().byId("assignOperatorDialogTable");
					var binding = oAssignOperatorDialogTable.getBinding("items");
					//As we can have multible OAs selectet we need to check if one of them fits to User defautl work center. 
					aFilters.push(new sap.ui.model.Filter("UserIsOpActyMainWrkCtrMfgUser", sap.ui.model.FilterOperator.EQ, true));
					binding.filter(aFilters, sap.ui.model.FilterType.Application); // update table binding
	
				},
				error: function (oError) {
					that._oAssignOperatorDialog.setBusy(false);
					jQuery.sap.log.error(oError.responseText);
				}
			});
	
			//to ensure that the info toolbar will be visible when the dialog will be reopen the dialog. 
			sap.ui.getCore().byId("infoToolbar").setVisible(true);
			sap.ui.getCore().byId("assignButton").setEnabled(false);
			sap.ui.getCore().byId("assignAndEditTimeButton").setEnabled(false);
	
			return this._oAssignOperatorDialog;
		},
		
		/**
		 * @private
		 * Inits the UnassignOperatorDialog and reads the assigned users that will be further processed (like unassigning of the users)
		 * @returns [{sap.m.Dialog}] returns the "_oUnassignOperatorDialog" dialog object
		 */
		_initUnassignOperatorDialog: function () {
			var that = this;
			
			// create upload dialog if not existing yet
			if (!this._oUnassignOperatorDialog) {
				this._oUnassignOperatorDialog = sap.ui.xmlfragment("i2d.mpe.workassign.manages1.ext.fragment.UnassignOperatorDialog", this);
				this._oUnassignOperatorDialog.setModel(this.getView().getModel("i18n"), "i18n");
				
				//fired after the dialog has been closed.
				this._oUnassignOperatorDialog.attachAfterClose(function (oEve) {
					//clear table data
					that._oUnassignOperatorDialog.getModel().destroy();
					sap.ui.getCore().byId("unassignOperatorDialogTable").destroyItems();
				});
			}
			
			var api = this.extensionAPI;
			var oOAContexts = api.getSelectedContexts();
			this.getView().getModel().setUseBatch(true); //if this is not already done
			var oUserData = new sap.ui.model.json.JSONModel({
				"I_OpActyUserAssgmt": []
			});
				
			var sGroup = jQuery.sap.uid(); // create an id under which the batch call will be executed
			this.getView().getModel().setDeferredGroups([sGroup]);
	
			oOAContexts.forEach(function (oOperationActyContext, index) {
				that._oUnassignOperatorDialog.setBusy(true); //Control Busy Indicator
				that.getView().getModel().read(oOperationActyContext.sPath, {
					groupId: sGroup,
					urlParameters: {
						"$expand": "to_OpActyUserAssgmt"
					},
					success: function (oData) {
						oUserData.getProperty("/I_OpActyUserAssgmt").push.apply(oUserData.getProperty("/I_OpActyUserAssgmt"),
							oData.to_OpActyUserAssgmt.results);
					},
					error: function (oError) {
						jQuery.sap.log.error(oError.responseText);
					}
				});
			});
	
			//Submits the collected changes | do the batch call
			this.getView().getModel().submitChanges({
				groupId: sGroup,
				success: function (oData) {
					//removing dublicat users
					var lookupObject = {};
					for (var i in oUserData.getData().I_OpActyUserAssgmt) {
						lookupObject[oUserData.getData().I_OpActyUserAssgmt[i].UserID] = oUserData.getData().I_OpActyUserAssgmt[i];
					}
	
					oUserData.getData().I_OpActyUserAssgmt = [];
					for (i in lookupObject) {
						oUserData.getData().I_OpActyUserAssgmt.push(lookupObject[i]);
					}
	
					that._oUnassignOperatorDialog.setModel(oUserData);
					that._oUnassignOperatorDialog.setBusy(false);
				},
				error: function (oError) {
					that._oUnassignOperatorDialog.setBusy(false);
					jQuery.sap.log.error(oError.responseText);
				}
			});
	
			sap.ui.getCore().byId("unassignButton").setEnabled(false);
			
			return this._oUnassignOperatorDialog;	
		},	
		
		/**
		 * Fired when selection is changed via user interaction in the table of the "Assign Operator" dialog. When the user checks or unchecks an operator.
		 * @param {sap.ui.base.Event} oControlEvent - An Event object consisting of an ID, a source and a map of parameters.
		 */
		onOperatorDialogSelectionChange: function (oEvent) {
			if (oEvent.getSource().getSelectedItems().length > 0) {
				sap.ui.getCore().byId("assignButton").setEnabled(true);
				sap.ui.getCore().byId("assignAndEditTimeButton").setEnabled(true);
			} else {
				sap.ui.getCore().byId("assignButton").setEnabled(false);
				sap.ui.getCore().byId("assignAndEditTimeButton").setEnabled(false);
			}
		},
	
		/**
		 * Fired when selection is changed via user interaction in the table of the "UnAssign Operator" dialog. When the user checks or unchecks an operator.
		 * @param {sap.ui.base.Event} oControlEvent - An Event object consisting of an ID, a source and a map of parameters.
		 */
		onAssignedOperatorDialogSelectionChange: function (oEvent) {
			if (oEvent.getSource().getSelectedItems().length > 0) {
				sap.ui.getCore().byId("unassignButton").setEnabled(true);
			} else {
				sap.ui.getCore().byId("unassignButton").setEnabled(false);
			}
		},
	
		/**
		 *	Fired when an item (row/operator) in the table of the "Assign Operator" dialog is pressed.
		 * 
		 *  It triggers the navigation to operator details page and reads the requierd information for it.
		 *  @param {sap.ui.base.Event} oControlEvent - An Event object consisting of an ID, a source and a map of parameters.
		 */
		onOperatorDialogItemPress: function (oEvent) {
			var oNavCon = sap.ui.getCore().byId("navConAssignOperatorDialog");
			var oDetailPage = sap.ui.getCore().byId("detailPageAssignOperatorDialog");
			var oItem = oEvent.getParameter("listItem");
	
			var oItemModel = oItem.getModel();
			var oSelectedUser = oItemModel.getProperty(oItem.getBindingContextPath());
			var oModel = this.getView().getModel();
			oDetailPage.setModel(oModel);
			
			//Creates the key from the given collection name and property map.
			var sPath = oModel.createKey("/C_OpActyAllManufacturingUsers", {
				"OpActyNtwkInstance": oSelectedUser.OpActyNtwkInstance,
				"OpActyNtwkElement": oSelectedUser.OpActyNtwkElement,
				"UserID": oSelectedUser.UserID
			});
	
			oDetailPage.bindElement(sPath);
			oNavCon.to(oDetailPage);
			var oBackButton = sap.ui.getCore().byId("backButton");
			oBackButton.setEnabled(true);
			var oAssignOperatorDialog = sap.ui.getCore().byId("assignOperatorDialog");
			oAssignOperatorDialog.setTitle(this.getView().getModel("i18n").getResourceBundle().getText("Operator"));
		},
	
		/**
		 * Back navigation to the Operators table.
		 * @param {sap.ui.base.Event} oControlEvent - An Event object consisting of an ID, a source and a map of parameters.
		 */
		onNavBackOperatorDialog: function (oEvent) {
			var oNavCon = sap.ui.getCore().byId("navConAssignOperatorDialog");
			oNavCon.back();
			var oBackButton = sap.ui.getCore().byId("backButton");
			oBackButton.setEnabled(false);
			sap.ui.getCore().byId("changePriorityButton").setEnabled(false);
			sap.ui.getCore().byId("assignmentsTable").removeSelections(true);
			var oAssignOperatorDialog = sap.ui.getCore().byId("assignOperatorDialog");
			oAssignOperatorDialog.setTitle(this.getView().getModel("i18n").getResourceBundle().getText("AssignOperatorsDialogTitle"));
		},
	
		/**
		 * Fired when the user clicks or taps on the "Assign" Button of the "Assign Operator" dialog.
		 * 
		 * The method assigns the selected users to the chosen operation activities.
		 * @param {sap.ui.base.Event} oControlEvent - An Event object consisting of an ID, a source and a map of parameters.  
		 */
		onAssignOperatorDialogAssign: function (oEvent) {
			var api = this.extensionAPI;
			var oOperationActyContexts = api.getSelectedContexts();
			var oTable = sap.ui.getCore().byId("assignOperatorDialogTable");
			var oSelctedUserContexts = oTable.getSelectedContexts();
	
			var that = this;
			var bShowSuccessToast = true;
			var sGroup = jQuery.sap.uid(); // create an id under which the batch call will be executed
			this.getView().getModel().setDeferredGroups([sGroup]);
	
			oOperationActyContexts.forEach(function (oOAContext, index, arr) {
				var oOA = oOAContext.getObject();
	
				oSelctedUserContexts.forEach(function (oUserContext, iUserIndex, oUserarray) {
					var oUser = oUserContext.getObject();
	
					that.getView().getModel().callFunction("/C_ProcgExecOpActyInstceTPAssignuser", // function import name
						{
							groupId: sGroup,
							method: "POST", // http method
							urlParameters: {
								"OpActyNtwkInstance": oOA.OpActyNtwkInstance,
								"OpActyNtwkElement": oOA.OpActyNtwkElement,
								"ExecUser": oUser.UserID
							}, // function import parameters
							success: function (oData, response) {
	
							}, // callback function for success
							error: function (oError) {
									//jQuery.sap.log.error(oError.responseText);
									var sResponseText = oError.responseText;
									if (sResponseText !== undefined) {
										var oResponseJSON;
										try {
											oResponseJSON = JSON.parse(sResponseText);
											var sMsg = oResponseJSON.error.message.value;
											sap.ui.core.BusyIndicator.hide();
											if (!this._bMessageOpen) {
												this._bMessageOpen = true;
												sap.m.MessageBox.error(
													sMsg, {
														id: "backEndErrorMessageBoxAssignOperator",
														title: that.getView().getModel("i18n").getResourceBundle().getText("AssignmentFailedMessage"),
														actions: [sap.m.MessageBox.Action.CLOSE],
														onClose: function () {
															this._bMessageOpen = false;
														}.bind(this)
													});
											}
										} catch (error) {
											sap.m.MessageToast.show(that.getView().getModel("i18n").getResourceBundle().getText("AssignmentFailedMessage"));
										}
									}
									bShowSuccessToast = false;
								} // callback function for error
						}
					);
				});
			});
	
			//Submits the collected changes | do the batch call
			this.getView().getModel().submitChanges({
				groupId: sGroup,
				success: function (oData) {
					that.getView().getModel().refresh(true);
	
					if (that._oAssignOperatorDialog) {
						//var oNavCon = sap.ui.getCore().byId("navConAssignOperatorDialog");
						//oNavCon.back();
						that._oAssignOperatorDialog.close();
					}
	
					if (bShowSuccessToast) {
						sap.m.MessageToast.show(that.getView().getModel("i18n").getResourceBundle().getText("AssignmentSuccessToast"));
					}
				},
				error: function (oError) {
					jQuery.sap.log.error(oError.responseText);
				}
			});
		},
	
		/**
		 * Fired when the user clicks or taps on the "Assign and Edit Time" Button of the "Assign Operator" dialog.
		 * 
		 * The method does the user assignment and time change at once. Befor assinging, it opens the "Edit Time" dialog.
		 * It assigns the selected users to the chosen operation activities and assigns the enterd time to the chosen OAs.
		 * @param {sap.ui.base.Event} oControlEvent - An Event object consisting of an ID, a source and a map of parameters.  
		 */
		onAssignOperatorDialogAssignAndTime: function (oEvent) {
			var that = this;
			var api = this.extensionAPI;
			var oOperationActyContexts = api.getSelectedContexts();
			
			var fnAfterCloseTimeForOADialog = function (oEve) {
				//fired after the dialog is closed.
				if (that._oAssignOperatorDialog.isOpen()) {
					sap.ui.getCore().byId("assignButton").firePress(); //do the operator assignment befor closing.
					var oNavCon = sap.ui.getCore().byId("navConAssignOperatorDialog");
					oNavCon.back();
					that._oAssignOperatorDialog.close();
				}
			};
			
			EditTimeForOADialog._initAndOpenEditTimeForOADialog(this.getView(), oOperationActyContexts, fnAfterCloseTimeForOADialog, fnAfterCloseTimeForOADialog);
		},
	
		/**
		 * Closes the Assign Operator Dialog 
		 * @param {sap.ui.base.Event} oEvent - An Event object consisting of an ID, a source and a map of parameters.  
		 */
		onAssignOperatorDialogCancel: function (oEvent) {
			var oNavCon = sap.ui.getCore().byId("navConAssignOperatorDialog");
			oNavCon.back();
			this._oAssignOperatorDialog.close();
		},
	
		/**
		 * Fired when the user clicks or taps on the "Unassign" Button of the "Assigned Operator" dialog.
		 * 
		 * The method unassigns the selected users to a chosen operation activity.
		 * @param {sap.ui.base.Event} oControlEvent - An Event object consisting of an ID, a source and a map of parameters.  
		 */
		onAssignedOperatorDialogUnassign: function (oEvent) {
			var api = this.extensionAPI;
			var oOperationActyContexts = api.getSelectedContexts();
			var oTable = sap.ui.getCore().byId("unassignOperatorDialogTable");
			var oSelctedUserContexts = oTable.getSelectedContexts();
	
			var that = this;
			var bShowSuccessToast = true;
			var sGroup = jQuery.sap.uid(); // create an id under which the batch call will be executed
			this.getView().getModel().setDeferredGroups([sGroup]);
	
			oOperationActyContexts.forEach(function (oOAContext, index, arr) {
				var oOA = oOAContext.getObject();
	
				oSelctedUserContexts.forEach(function (oUserContext, iUserIndex, oUserarray) {
					var oUser = oUserContext.getObject();
	
					that.getView().getModel().callFunction("/C_ProcgExecOpActyInstceTPUnassign_user", // function import name
						{
							groupId: sGroup,
							method: "POST", // http method
							urlParameters: {
								"OpActyNtwkInstance": oOA.OpActyNtwkInstance,
								"OpActyNtwkElement": oOA.OpActyNtwkElement,
								"ExecUser": oUser.UserID
							}, // function import parameters
							success: function (oData, response) {
	
							}, // callback function for success
							error: function (oError) {
									var sResponseText = oError.responseText;
									if (sResponseText !== undefined) {
										var oResponseJSON;
										try {
											oResponseJSON = JSON.parse(sResponseText);
											var sMsg = oResponseJSON.error.message.value;
											sap.ui.core.BusyIndicator.hide();
											if (!this._bMessageOpen) {
												this._bMessageOpen = true;
												sap.m.MessageBox.error(
													sMsg, {
														id: "backEndErrorMessageBoxAssignOperator",
														title: that.getView().getModel("i18n").getResourceBundle().getText("UnassignmentUserFailedMessage"),
														actions: [sap.m.MessageBox.Action.CLOSE],
														onClose: function () {
															this._bMessageOpen = false;
														}.bind(this)
													});
											}
										} catch (error) {
											sap.m.MessageToast.show(that.getView().getModel("i18n").getResourceBundle().getText("UnassignmentUserFailedMessage"));
										}
									}
									bShowSuccessToast = false;
								} // callback function for error
						}
					);
				});
			});
	
			//Submits the collected changes | do the batch call
			this.getView().getModel().submitChanges({
				groupId: sGroup,
				success: function (oData) {
					that.getView().getModel().refresh(true);
	
					if (that._oUnassignOperatorDialog) {
						that._oUnassignOperatorDialog.close();
					}
	
					if (bShowSuccessToast) {
						sap.m.MessageToast.show(that.getView().getModel("i18n").getResourceBundle().getText("UnassignUserSuccessToast"));
					}
				},
				error: function (oError) {
					jQuery.sap.log.error(oError.responseText);
				}
			});
		},
	
		/**
		 * Closes the Unassign Operator Dialog 
		 * @param {sap.ui.base.Event} oEvent - An Event object consisting of an ID, a source and a map of parameters.  
		 */
		onUnassignOperatorDialogCancel: function (oEvent) {
			this._oUnassignOperatorDialog.close();
		},
	
		/**
		 * Removes the workcenter filter in the dialog.
		 * Triggered by the cancel button in the info toolbar.
		 * @param {sap.ui.base.Event} oEvent - An Event object consisting of an ID, a source and a map of parameters.  
		 */
		onResetWorkCenterFilters: function (oEvent) {
			//this._oAssignOperatorDialog.setModel(this.getView().getModel());
			//this._oAssignOperatorDialog.getModel().refresh(true);
	
			var aFilters = [];
			var list = sap.ui.getCore().byId("assignOperatorDialogTable");
			var binding = list.getBinding("items");
			aFilters.push(new sap.ui.model.Filter("UserIsOpActyMainWrkCtrMfgUser", sap.ui.model.FilterOperator.EQ, true));
			aFilters.push(new sap.ui.model.Filter("UserIsOpActyMainWrkCtrMfgUser", sap.ui.model.FilterOperator.EQ, false));
	
			var allFilters = new sap.ui.model.Filter(aFilters, false); //combine the filters with  an OR (false) operator
			binding.filter(allFilters, sap.ui.model.FilterType.Application); // update list binding 
	
			sap.ui.getCore().byId("infoToolbar").setVisible(false); // hide infoT
			sap.ui.getCore().byId("idSearchFieldOperatorDialog").setValue(""); //	clear search field
		},
	
		/**
		 * Triggered by the link in the OA table. It opens popup of all assigned user to that particular OA.
		 * 
		 * @param {sap.ui.base.Event} oEvent - An Event object consisting of an ID, a source and a map of parameters.  
		 */
		onUserLinkPress: function (oEvent) {
			var oItemBindingContext = oEvent.getSource().getBindingContext();
			var that = this;
	
			var oUsersData = new sap.ui.model.json.JSONModel({
				"I_OpActyUserAssgmt": []
			});
	
			// create popover
			if (!this._oPopoverUsers) {
				this._oPopoverUsers = sap.ui.xmlfragment("i2d.mpe.workassign.manages1.ext.fragment.UsersPopover", this);
				this._oPopoverUsers.setModel(this.getView().getModel("i18n"), "i18n");
			}
	
			this._oPopoverUsers.openBy(oEvent.getSource());
	
			this.getView().getModel().read(oItemBindingContext.getPath(), {
				urlParameters: {
					"$expand": "to_OpActyUserAssgmt"
				},
				success: function (oData) {
					oUsersData.getProperty("/I_OpActyUserAssgmt").push.apply(oUsersData.getProperty("/I_OpActyUserAssgmt"), oData.to_OpActyUserAssgmt
						.results);
					that._oPopoverUsers.setModel(oUsersData);
				},
				error: function (oError) {
					jQuery.sap.log.error(oError.responseText);
				}
			});
		},
	
		/**
		 * Triggered by the search field of the "Assign Operator" Dialog
		 * Filters the tabel by the enterd values in the search field
		 * 
		 * @param {sap.ui.base.Event} oEvent - An Event object consisting of an ID, a source and a map of parameters.  
		 */
		onSearchInOperatorDialog: function (oEvent) {
			// add filter for search
			var aInfoToolbarFilters = [];
			var sQuery = oEvent.getSource().getValue();
			var oList = sap.ui.getCore().byId("assignOperatorDialogTable");
			var binding = oList.getBinding("items");
	
			// if the toolbar is visible we musst ensur that the filtering by default work center is also done.
			if (sap.ui.getCore().byId("infoToolbar").getVisible() === true) {
				aInfoToolbarFilters.push(new sap.ui.model.Filter("UserIsOpActyMainWrkCtrMfgUser", sap.ui.model.FilterOperator.EQ, true));
			}
	
			if (sQuery && sQuery.length > 0) {
				var aQueryFilters = [];
				aQueryFilters.push(new sap.ui.model.Filter("UserID", sap.ui.model.FilterOperator.Contains, sQuery));
				aQueryFilters.push(new sap.ui.model.Filter("UserDescription", sap.ui.model.FilterOperator.Contains, sQuery));
				aQueryFilters.push(new sap.ui.model.Filter("WorkCenter", sap.ui.model.FilterOperator.Contains, sQuery));
				aQueryFilters.push(new sap.ui.model.Filter("WorkCenterText", sap.ui.model.FilterOperator.Contains, sQuery));
				var orFilters = new sap.ui.model.Filter(aQueryFilters, false); //combine the filters with  an OR (false) operator
	
				if (sap.ui.getCore().byId("infoToolbar").getVisible() === true) {
					var aQueryAndInfoToolbarFilters = [];
					aQueryAndInfoToolbarFilters.push(orFilters);
					aQueryAndInfoToolbarFilters.push(aInfoToolbarFilters);
					var andFilters = new sap.ui.model.Filter(aQueryAndInfoToolbarFilters, true); //combine the filters with  an AND (true) operator
					binding.filter(andFilters, sap.ui.model.FilterType.Application); // update list binding 
				} else {
					binding.filter(orFilters, sap.ui.model.FilterType.Application); // update list binding 
				}
			} else {
				binding.filter(aInfoToolbarFilters, sap.ui.model.FilterType.Application); // update list binding
			}
		},
	
		/**
		 * Triggered if one presses the Phone Number link.
		 * Triggers a telephone to call given telephone number.
		 * @param {sap.ui.base.Event} oEvent - An Event object consisting of an ID, a source and a map of parameters.  
		 */
		handlePhoneNumberLinkPress: function (oEvent) {
			sap.m.URLHelper.triggerTel(oEvent.getSource().getProperty("text"));
		},
	
		/**
		 * Triggered if one presses the Moblie Phone Number link.
		 * Triggers a telephone to call given telephone number.
		 * @param {sap.ui.base.Event} oEvent - An Event object consisting of an ID, a source and a map of parameters.  
		 */
		handleMobilePhoneNumberLinkPress: function (oEvent) {
			sap.m.URLHelper.triggerTel(oEvent.getSource().getProperty("text"));
		},
	
		/**
		 * Triggered if one presses the Email link.
		 * Trigger email application to send email.
		 * @param {sap.ui.base.Event} oEvent - An Event object consisting of an ID, a source and a map of parameters.  
		 */
		handleEmailAddressLinkPress: function (oEvent) {
			sap.m.URLHelper.triggerEmail(oEvent.getSource().getProperty("text"));
		},
		/**
		 * Fires after items binding is updated of the Assignments Table
		 *  @param {sap.ui.base.Event} oEvent - An Event object consisting of an ID, a source and a map of parameters.  
		 */
		onUpdateAssignmentsTableFinished: function (oEvent) {
			//update the table count
			var iCount = oEvent.getParameter("total");
			var oAssignmentsTableTitle = sap.ui.getCore().byId("assignmentsTableTitle");
			oAssignmentsTableTitle.setText(this.getView().getModel("i18n").getResourceBundle().getText("AssignmentsTitle", [iCount]));
		},
	
		/**
		 * Fires after items binding is updated of the Qualifications Table
		 *  @param {sap.ui.base.Event} oEvent - An Event object consisting of an ID, a source and a map of parameters.  
		 */
		onUpdateActiveQualificationsTableFinished: function (oEvent) {
			//update the table count
			var iCount = oEvent.getParameter("total");
			var oActiveQualificationsTableTitle = sap.ui.getCore().byId("activeQualificationsTableTitle");
			oActiveQualificationsTableTitle.setText(this.getView().getModel("i18n").getResourceBundle().getText("QualificationsTitle", [
				iCount
			]));
		},
		
		/**
		 * Fired when selection is changed via user interaction in the table of the "Assign Operator" dialog. When the user checks or unchecks an operator.
		 * @param {sap.ui.base.Event} oControlEvent - An Event object consisting of an ID, a source and a map of parameters.
		 */
		onAssignmentsTableSelectionChange: function (oEvent) {
			if (oEvent.getSource().getSelectedItems().length > 0) {
				sap.ui.getCore().byId("changePriorityButton").setEnabled(true);
			} else {
				sap.ui.getCore().byId("changePriorityButton").setEnabled(false);
			}
		},
		
		/**
		 * Fired when the user clicks on the "Change Priority" Button 
		 * @param {sap.ui.base.Event} oEvent - An Event object consisting of an ID, a source and a map of parameters.
		 */
		onClickChangePriority: function (oEvent) {
			var oAssignedActivitySelectedItem = sap.ui.getCore().byId("assignmentsTable").getSelectedItem().getBindingContext().getObject();
			ChangePriorityDialog.initAndOpen(this.getView(), oAssignedActivitySelectedItem);
		}
		
	});
});
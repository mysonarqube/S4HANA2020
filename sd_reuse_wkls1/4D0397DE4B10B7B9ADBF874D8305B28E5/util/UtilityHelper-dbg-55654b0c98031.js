/*
 * Copyright (C) 2009-2022 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.require("sap.ui.model.resource.ResourceModel");
 
sap.ui.define(["sap/ui/base/Object"],
	function (baseObject) {
		"use strict";

		return baseObject.extend("cus.sd.lib.worklist.util.UtilityHelper", {
			
			i18nBundle: new sap.ui.model.resource.ResourceModel({
					bundleUrl: jQuery.sap.getModulePath("cus.sd.lib.worklist") + "/" + "i18n/i18n.properties"
			}),
			
			initi18nReuseLib: function initi18nReuseLib() {
				//init i18n for Reuse Lib
				this.getView().setModel( this.util.i18nBundle, "i18nReuseLib");
				this.i18nReuseLib = this.getView().getModel("i18nReuseLib");
			},
			//****** Custom Filters *******//

			onInitSmartFilterBarExtensionBase: function onInitSmartFilterBarExtensionBase(oCustomControl) {
				oCustomControl.attachChange(function (oChangeEvent) {
					var bValid = oChangeEvent.getParameter("valid");
					if (bValid) {
						oCustomControl.setValueState(sap.ui.core.ValueState.None);
					} else {
						oCustomControl.setValueState(sap.ui.core.ValueState.Error);
					}
				}, this);
			},

			onInitSetDateDefault: function (oSmartFilterBar, aCtrlConfig) {
				for (var i = 0; i < aCtrlConfig.length; i++) {
					oSmartFilterBar.getConditionTypeByKey(aCtrlConfig[i].keyDate).setOperation("DATE");
				}
			},

			onBeforeRebindTableExtensionBase: function onBeforeRebindTableExtensionBase(oBindingParams, oSmartFilterBar, ctrlConfig, fnGetControl) {
				oBindingParams.parameters = oBindingParams.parameters || {};
				if (oSmartFilterBar instanceof sap.ui.comp.smartfilterbar.SmartFilterBar) {
					if (ctrlConfig.keyPO) {
						var oCustomControl = fnGetControl(ctrlConfig.keyPO);
						if (oSmartFilterBar instanceof sap.ui.comp.smartfilterbar.SmartFilterBar &&
							oCustomControl.getValue()) {
							oBindingParams.filters.push(new sap.ui.model.Filter(ctrlConfig.keyPO, sap.ui.model.FilterOperator.Contains, oCustomControl.getValue()));
						}
					}
					if (ctrlConfig.keyRS) {
						oCustomControl = fnGetControl(ctrlConfig.keyRS);
						this._fnRebindFixedValues(oBindingParams, oCustomControl, oSmartFilterBar, ctrlConfig.keyRS);
					}
					if (ctrlConfig.keyTBS) {
						oCustomControl = fnGetControl(ctrlConfig.keyTBS);
						this._fnRebindFixedValues(oBindingParams, oCustomControl, oSmartFilterBar, ctrlConfig.keyTBS);
					}
					if (ctrlConfig.keyLE) {
						oCustomControl = fnGetControl(ctrlConfig.keyLE);
						this._fnRebindExtendDate(oBindingParams, oCustomControl, oSmartFilterBar, ctrlConfig.keyED);
					}
				}
			},

			// Currently not consumed as our custom filters based on fixed values have been redesigned as standard filters
			_fnRebindFixedValues: function __fnRebindFixedValues(oBindingParams, oCustomControl, oSmartFilterBar, keyFV) {
				if (oSmartFilterBar instanceof sap.ui.comp.smartfilterbar.SmartFilterBar &&
					oCustomControl.getSelectedKeys()[0]) {
					var value1;
					var value2;
					for (var i = 0; i < oCustomControl.getSelectedKeys().length; i++) {
						//selecting status A leads to push for A and blank
						if (oCustomControl.getSelectedKeys()[i] === "A") {
							value1 = " ";
							value2 = "A";
							oBindingParams.filters.push(new sap.ui.model.Filter(keyFV, sap.ui.model.FilterOperator.EQ, value1));
							oBindingParams.filters.push(new sap.ui.model.Filter(keyFV, sap.ui.model.FilterOperator.EQ, value2));
						} else {
							oBindingParams.filters.push(new sap.ui.model.Filter(keyFV, sap.ui.model.FilterOperator.EQ, oCustomControl.getSelectedKeys()[i]));
						}
					}
				}
			},

			_fnRebindExtendDate: function _fnRebindExtendDate(oBindingParams, oCustomControl, oSmartFilterBar, keyED) {
				if (oSmartFilterBar instanceof sap.ui.comp.smartfilterbar.SmartFilterBar && oCustomControl.getDateValue()) {
					var oDateValue = new Date(oCustomControl.getDateValue().valueOf() - oCustomControl.getDateValue().getTimezoneOffset() * 60 * 1000);
					var aExpiresTill = [new sap.ui.model.Filter(keyED, sap.ui.model.FilterOperator.LE, oDateValue),
						new sap.ui.model.Filter(keyED, sap.ui.model.FilterOperator.GT, new Date(null))
					];
					var oCustomMultiFilter = new sap.ui.model.Filter(aExpiresTill, true);
					//Special handling for multiple multi-filters
					if (oBindingParams.filters[0] && oBindingParams.filters[0].aFilters) {
						var oSmartTableMultiFilter = oBindingParams.filters[0];
						oBindingParams.filters[0] = new sap.ui.model.Filter([oSmartTableMultiFilter, oCustomMultiFilter], true);
					} else {
						oBindingParams.filters.push(oCustomMultiFilter);
					}
				}
			},

			customAppStateDataExtensionBase: function getCustomAppStateDataExtensionBase(oCustomData, customFilter, fn) {
				var mapCustomFilterToCustomData = function mapCustomFilterToCustomData(filterElement) {
					fn(oCustomData, filterElement);
				};
				customFilter.forEach(mapCustomFilterToCustomData);
			},

			handleDateChangeBase: function handleDateChangeBase(oEvent) {
				if (oEvent.getParameter("value")) {
					oEvent.getSource().data("hasValue", true);
				} else {
					oEvent.getSource().data("hasValue", false);
				}
			},

			// Currently not consumed as our custom filters based on fixed values have been redesigned as standard filters
			handleKeyChangeBase: function handleKeyChangeBase(oEvent) {
				var aKeys = oEvent.getSource().getSelectedKeys();
				if (aKeys.length === 1) {
					//if only one item is selected and this one is deselected again at item level
					if (oEvent.getParameter("value") && oEvent.getParameter("value") === oEvent.getSource().getItemByKey(aKeys[0]).getText()) {
						oEvent.getSource().data("hasValue", false);
					} else {
						oEvent.getSource().data("hasValue", true);
					}
					//if there is only one item and this is removed in the filter
				} else if (aKeys.length === 0 && !oEvent.getParameter("value")) {
					oEvent.getSource().data("hasValue", false);
				} else {
					oEvent.getSource().data("hasValue", true);
				}
			},

			//Private functions for custom filter processing

			_fnGetValue: function (oCustomData, filterElement) {
				var getFunc = {
					getValue: function () {
						oCustomData[filterElement.fieldName] = filterElement.fieldObject.getValue();
					},
					getDateValue: function () {
						var fieldObj = filterElement.fieldObject;
						if (!fieldObj.getDateValue()) {
							//avoid dummy value in UI
							if (fieldObj.getValueState() !== "Error") {
								fieldObj.setValue(fieldObj.getDateValue());
							}
							oCustomData[filterElement.fieldName] = fieldObj.getDateValue();
						} else {
							oCustomData[filterElement.fieldName] = fieldObj.getValue();
						}
					},
					getSelectedKeys: function () {
						if (filterElement.fieldObject) {
							oCustomData[filterElement.fieldName] = filterElement.fieldObject.getSelectedKeys();
						}
					}
				};
				getFunc[filterElement.methodName]();
			},

			_fnRestoreValue: function (oCustomData, filterElement) {
				var setFunc = {
					setValue: function () {
						if (oCustomData[filterElement.fieldName] !== undefined) {
							if (filterElement.fieldObject) {
								filterElement.fieldObject.setValue(oCustomData[filterElement.fieldName]);
							}
						}
					},
					setDateValue: function () {
						if (oCustomData[filterElement.fieldName] !== undefined) {
							if (filterElement.fieldObject) {
								filterElement.fieldObject.setValue(oCustomData[filterElement.fieldName]);
								if (oCustomData[filterElement.fieldName]) {
									filterElement.fieldObject.data("hasValue", true);
								} else {
									filterElement.fieldObject.data("hasValue", false);
								}
							}
						}
					},
					setSelectedKeys: function () {
						var customField = oCustomData[filterElement.fieldName];
						if (customField !== undefined) {
							if (filterElement.fieldObject) {
								filterElement.fieldObject.setSelectedKeys(customField);
								if (customField.length > 0) {
									filterElement.fieldObject.data("hasValue", true);
								} else {
									filterElement.fieldObject.data("hasValue", false);
								}
							} else {
								filterElement.fieldObject.data("hasValue", false);
							}
						} else {
							filterElement.fieldObject.data("hasValue", false);
						}
					}
				};
				setFunc[filterElement.methodName]();
			},

			//****** Single Select Quick Actions ******//

			onActionWithInput: function onActionWithInput(that, oExtensionAPI, sPopUpFragment, i18nPath, fnGetStrip, sFieldName, fnOnChange) {
				var self = this;
				var oActionData = this._prepareActionCall(oExtensionAPI);
				var context = oActionData.extensionAPI.getSelectedContexts()[0];
				var oTransactionController = oActionData.extensionAPI.getTransactionController();

				this.oParameterDialog = self._fnGetActionWithInputDialog(that, self, context, sPopUpFragment, sFieldName, oTransactionController,
					i18nPath, oActionData, fnGetStrip, fnOnChange);
				this.oParameterDialog.setBindingContext(oActionData.extensionAPI.getSelectedContexts()[0]);
				oActionData.extensionAPI.attachToView(this.oParameterDialog);
				this.oParameterDialog.setEscapeHandler(this._fnEscapeHandler(oTransactionController));
				this.oParameterDialog.open();
			},

			onActionWithoutInput: function onActionWithoutInput(that, oExtensionAPI, sPopUpFragment, i18nPath, fnGetStrip, usecase) {
				var self = this;
				var oActionData = this._prepareActionCall(oExtensionAPI);
				var oTransactionController = oActionData.extensionAPI.getTransactionController();
				var context = oActionData.extensionAPI.getSelectedContexts()[0];
				var contextProperty = context.sPath + '/' + usecase;
				if (context.oModel.getProperty(contextProperty) === "") {
					this._messageOnEmptyField(that, i18nPath);
					oTransactionController.cancel();
				} else {
					context.oModel.setProperty(contextProperty, " ");
					var oPromise = oTransactionController.save();
					oPromise.then(
						function () {
							self._messageOnSuccess(that, i18nPath, oActionData);
						},
						function (err) {
							self._onOpenDialogWithoutInput(that, sPopUpFragment, oTransactionController, oActionData, i18nPath, fnGetStrip, err);
						}
					);
				}
			},

			onRejectAllowedReasons: function onRejectAllowedReasons(that, oExtensionAPI, sFieldName) {
				var self = this;
				var oActionData = this._prepareActionCall(oExtensionAPI);
				var oTransactionController = oActionData.extensionAPI.getTransactionController();

				var fragPath = "cus.sd.lib.worklist.ext.fragments.CustomActionPopUpAllowedRjcnReasons";
				var fnGetStrip = function () {
					return that.byId("rejectAllItemsMessageStrip");
				};

				//Determine the path of the navigation property from the selected context
				var context = oActionData.extensionAPI.getSelectedContexts()[0];
				var sPath = context.sPath + "/to_" + sFieldName;

				//Create template and sorter
				var oItemTemplate = new sap.ui.core.Item({
					key: "{SalesDocumentRjcnReason}",
					text: "{SalesDocumentRjcnReason_Text}"
				});

				var oSorter = new sap.ui.model.Sorter({
					path: 'SalesDocumentRjcnReason_Text'
				});

				this.oParameterDialog = self._fnGetActionWithInputDialog(that, self, context, fragPath, sFieldName, oTransactionController,
					"i18n", oActionData, fnGetStrip);

				this.oParameterDialog.setModel(that.i18nReuseLib, "i18n");

				var oSelectCtrl = this.oParameterDialog.getContent()[0].getContent().filter(function (obj) {
					return obj.getId().indexOf(sFieldName) !== -1;
				})[0];

				//Bind items dynamically to select control
				oSelectCtrl.bindItems(sPath, oItemTemplate, oSorter);

				this.oParameterDialog.setBindingContext(oActionData.extensionAPI.getSelectedContexts()[0]);
				oActionData.extensionAPI.attachToView(this.oParameterDialog);
				this.oParameterDialog.setEscapeHandler(this._fnEscapeHandler(oTransactionController));
				this.oParameterDialog.open();
			},

			// Private functions in single select quick actions

			_onOpenDialogWithoutInput: function _onOpenDialogWithoutInput(that, sPopUpFragment, oTransactionController, oActionData, i18nPath,
				fnGetStrip, err) {
				var oParameterDialog = this._fnGetActionWithoutInputDialog(that, sPopUpFragment, oTransactionController);
				oParameterDialog.setEscapeHandler(oTransactionController);
				oActionData.extensionAPI.attachToView(oParameterDialog);
				oParameterDialog.open();
				this._messageOnFailure(that, err, fnGetStrip);
				oActionData.extensionAPI.getTransactionController().cancel();
				oActionData.extensionAPI.refreshTable();
			},

			_fnGetActionWithInputDialog: function _fnGetActionWithInputDialog(that, self, context, sPopUpFragment, sFieldName,
				oTransactionController, i18nPath, oActionData, fnGetStrip, fnOnChange) {
				var oParameterDialog = sap.ui.xmlfragment(that.getView().getId(),
					sPopUpFragment, {
						onOKPressed: function () {
							if (that.getView().getModel().hasPendingChanges()) {
								self._fnToggleEnableButtons(self.oParameterDialog.getButtons());
								self.oParameterDialog.setBusy(true);
								var oPromise = oTransactionController.save();
								oPromise.then(function () {
										self.oParameterDialog.close();
										self._messageOnSuccess(that, i18nPath, oActionData);
									},
									function (err) {
										that.extensionAPI.refreshTable();
										self._fnToggleEnableButtons(self.oParameterDialog.getButtons());
										self.oParameterDialog.setBusy(false);
										self._messageOnFailure(that, err, fnGetStrip);
									});
							} else {
								var oMessageStrip = fnGetStrip(that);
								oMessageStrip.setVisible(true);
								oMessageStrip.setText(that.getView().getModel(i18nPath).getResourceBundle().getText("SELECT_VALUE_MSG"));
							}
						},
						onCancelPressed: function () {
							self._fnToggleEnableButtons(self.oParameterDialog.getButtons());
							oTransactionController.cancel();
							self.oParameterDialog.close();
						},
						afterClose: function () {
							self.oParameterDialog.destroy();
						},
						afterOpen: function () {
							if (sFieldName) {
								this.preChangeValue = context.oModel.getProperty(context.sPath)[sFieldName];
							}
						},
						onChange: function (oEvent) {
							if (sFieldName === "SalesDocumentRjcnReason") {
								var sPath = context.sPath + "/" + sFieldName;
								var selectedKey = oEvent.getSource().getSelectedItem().getKey();
								that.getView().getModel().setProperty(sPath, selectedKey);
							} else if (sFieldName === "BindingPeriodValidityEndDate") {
								var postChangeValue = context.oModel.getProperty(context.sPath)[sFieldName];
								if (fnOnChange) {
									fnOnChange.apply(that, [this.preChangeValue, postChangeValue]);
								}
							}
						}
					});
				return oParameterDialog;
			},

			_fnGetActionWithoutInputDialog: function _fnGetActionWithoutInputDialog(that, sPopUpFragment, oTransactionController) {
				var oParameterDialog = sap.ui.xmlfragment(that.getView().getId(),
					sPopUpFragment, {
						onOKPressed: function () {
							try {
								oTransactionController.cancel();
							} catch (e) {
								jQuery.sap.log.error(e.message);
							}
							oParameterDialog.close();
						},
						afterClose: function () {
							oParameterDialog.destroy();
						}
					}
				);
				return oParameterDialog;
			},

			_prepareActionCall: function _prepareActionCall(oExtensionAPI) {
				oExtensionAPI.getTransactionController().edit(oExtensionAPI.getSelectedContexts()[0]);
				return {
					extensionAPI: oExtensionAPI
				};
			},

			_fnEscapeHandler: function _fnEscapeHandler(oTransactionController) {
				var fnEscapeHandler = function (oPromise) {
					oPromise.resolve({
						then: oTransactionController.cancel()
					});
				};
				return fnEscapeHandler;
			},

			_fnToggleEnableButtons: function _fnToggleEnableButtons(aButtons) {
				for (var i = 0; i < aButtons.length; i++) {
					aButtons[i].setEnabled(!aButtons[i].getEnabled());
				}
			},

			// Private functions for message processing

			_messageOnSuccess: function _messageOnSuccess(that, i18nPath, oActionData) {
				sap.m.MessageToast.show(that.getView().getModel(i18nPath).getResourceBundle()
					.getText("SUCCESSFUL_OPERATION"));
				oActionData.extensionAPI.refreshTable();
			},

			_messageOnEmptyField: function _messageOnEmptyField(that, i18nPath) {
				sap.m.MessageToast.show(that.getView().getModel(i18nPath).getResourceBundle()
					.getText("EMPTY_FIELD"));
			},

			_messageOnInvalidDoc: function _messageOnSuccess(that, fnGetStrip) {
				var oMessageStrip = fnGetStrip(that);
				oMessageStrip.setVisible(true);
				oMessageStrip.setText(that.i18nReuseLib.getResourceBundle().getText("ENTER_VALUE_MSG"));
			},

			// Used for single and mass change
			_messageOnFailure: function _messageOnFailure(that, err, fnGetStrip) {
				var oMessageStrip = fnGetStrip(that);
				var errorText;
				if (err.response.response === undefined) {
					if (err.response.body && err.response.headers["Content-Type"].indexOf("json") !== -1) {
						errorText = JSON.parse(err.response.body).error.message.value;
					} else if (err.response.responseText && err.response.headers["Content-Type"].indexOf("json") !== -1) {
						errorText = JSON.parse(err.response.responseText).error.message.value;
					} else {
						if (err.message) {
							errorText = err.message;
						} else {
							errorText = err.response.message;
						}
					}
				} else {
					errorText = err.response.response.statusText;
				}
				oMessageStrip.setVisible(true);
				oMessageStrip.setType("Error");
				oMessageStrip.setText(errorText);
			},

			//****** Mass Change Quick Actions *******//

			onActionWithInputMassChange: function onActionWithInputMassChange(that, aUpdateContext, oExtensionAPI, usecase, fnRemoveSelection,
				sSrvUrl) {
				var self = this;
				var oView = that.getView();

				var bLimit = (aUpdateContext.length > 25) ? true : false;

				var oFrag = this._fnGetPopUpFragment(usecase.idControl, bLimit);

				var fnGetStrip = function () {
					return that.byId(oFrag.sMsgStripId);
				};

				if (bLimit) {
					this.oParameterDialog = self._fnGetActionWithoutInputDialogMassChange(that);
					this.oParameterDialog.setModel(that.i18nReuseLib, "i18n");
					if (!this.oParameterDialog.getTitle()) {
						this.oParameterDialog.setTitle(that.i18nReuseLib.getResourceBundle().getText("set" + usecase.idControl));
					}
					self._getMessageForMassChangeActions.call(that, fnGetStrip, that.i18nReuseLib.getResourceBundle().getText("DOC_LIMIT"), "Error");
				} else {
					this.oParameterDialog = self._fnGetActionWithInputDialogMassChange(that, self, oFrag.sFragPath, usecase.idControl, fnGetStrip,
						aUpdateContext, oExtensionAPI, fnRemoveSelection, sSrvUrl);
					oView.addDependent(this.oParameterDialog);
					this.oParameterDialog.setModel(that.i18nReuseLib, "i18n");
				}
				this.oParameterDialog.open();
			},

			onActionWithoutInputMassChange: function onActionWithoutInputMassChange(that, aUpdateContext, oExtensionAPI, usecase,
				fnRemoveSelection, sSrvUrl) {
				var self = this;
				var mergeData = {};
				mergeData[usecase.idControl] = " ";

				var fnGetStrip = function () {
					return that.byId("singleErrorMessageStripForActions");
				};

				var fnMergeRequestBatch = function () {
					self._mergeRequestBatch.call(that, self, aUpdateContext, mergeData, undefined, fnGetStrip, oExtensionAPI,
						fnRemoveSelection, sSrvUrl);
				};

				if (aUpdateContext.length <= 25) {
					if (aUpdateContext.bDrafts) {
						var oWarningDialog = self._fnGetActionWithoutInputDialogMassChange(that, fnMergeRequestBatch);
						oWarningDialog.setModel(that.i18nReuseLib, "i18n");
						self._getMessageForMassChangeActions.call(that, fnGetStrip, that.i18nReuseLib.getResourceBundle().getText("IGNORE_DRAFTS"),
							"Warning");
						oWarningDialog.open();
					} else {
						fnMergeRequestBatch();
					}
				} else {
					var oErrorDialog = self._fnGetActionWithoutInputDialogMassChange(that);
					oErrorDialog.setModel(that.i18nReuseLib, "i18n");
					oErrorDialog.setTitle(that.i18nReuseLib.getResourceBundle().getText("remove" + usecase.idControl));

					self._getMessageForMassChangeActions.call(that, fnGetStrip, that.i18nReuseLib.getResourceBundle().getText(
						"DOC_LIMIT"), "Error");
					oErrorDialog.open();
				}
			},

			getUpdateContextListReportTable: function (extensionAPI) {
				var oTableSelectedItems = extensionAPI.getSelectedContexts();
				var selectedItems = new Array();
				for (var zl = 0; zl < oTableSelectedItems.length; zl++) {
					var selectedObj = {};
					selectedObj.path = oTableSelectedItems[zl].getPath();
					selectedObj.etag = oTableSelectedItems[zl].getModel().getProperty(selectedObj.path).__metadata.etag;
					selectedItems.push(selectedObj);
				}
				return selectedItems;
			},

			getUpdateContextListReportDraftTable: function (extensionAPI, sEntitySet, docType) {
				var oTableSelectedItems = extensionAPI.getSelectedContexts();
				var selectedItems = new Array();
				for (var zl = 0; zl < oTableSelectedItems.length; zl++) {
					var selectedObj = {};
					selectedObj.path = oTableSelectedItems[zl].getPath();
					var oDocument = this.getView().getModel().getProperty(selectedObj.path);
					if (oDocument[docType]) {
						selectedObj.altPath = sEntitySet + "('" + oDocument[docType] + "')";
						selectedItems.push(selectedObj);
					} else {
						selectedItems.bDrafts = true;
					}
				}
				return selectedItems;
			},

			// Private functions for mass change actions

			_fnGetActionWithInputDialogMassChange: function _fnGetActionWithInputDialogMassChange(that, self, sPopUpFragment,
				idSelectControl, fnGetStrip, selectedItems, oExtensionAPI, fnRemoveSelection, sSrvUrl) {
				var oParameterDialog = sap.ui.xmlfragment(that.getView().getId(),
					sPopUpFragment, {
						onOKPressed: function (oEvent) {
							if (selectedItems.length <= 25) {
								//// TODO: check handling when the same change is triggered twice
								self._fnToggleEnableButtons(self.oParameterDialog.getButtons());
								self.oParameterDialog.setBusy(true);

								var dialogContent = oEvent.getSource().getParent().getContent()[0].getContent();
								var selectedKey;

								for (var zy = 0; zy < dialogContent.length; zy++) {
									if (dialogContent[zy].getId().indexOf(idSelectControl) !== -1) {
										var oSelectControl = dialogContent[zy];
										selectedKey = oSelectControl.getProperty("selectedKey");
									}
								}
								var mergeData = {};
								if (selectedKey) {
									mergeData[idSelectControl] = selectedKey;
									self._mergeRequestBatch.call(that, self, selectedItems, mergeData, self.oParameterDialog, fnGetStrip,
										oExtensionAPI, fnRemoveSelection, sSrvUrl);
								} else {
									self._getMessageForMassChangeActions.call(that, fnGetStrip, that.i18nReuseLib.getResourceBundle().getText(
											"SELECT_VALUE"),
										"Error");
									self._fnToggleEnableButtons(self.oParameterDialog.getButtons());
									self.oParameterDialog.setBusy(false);
								}
							} else {
								self.oParameterDialog.close();
							}
						},
						onCancelPressed: function () {
							self._fnToggleEnableButtons(self.oParameterDialog.getButtons());
							self.oParameterDialog.close();
						},
						afterClose: function () {
							self.oParameterDialog.destroy();
						},
						beforeOpen: function () {
							if (selectedItems.bDrafts) {
								self._getMessageForMassChangeActions.call(that, fnGetStrip, that.i18nReuseLib.getResourceBundle().getText("IGNORE_DRAFTS"),
									"Warning");
							}
						}
					});
				return oParameterDialog;
			},

			_fnGetActionWithoutInputDialogMassChange: function _fnGetActionWithoutInputDialogMassChange(that, fnMergeRequestBatch) {
				var sPath = "cus.sd.lib.worklist.ext.fragments.CustomActionSingleMessagePopUp";
				var oParameterDialog = sap.ui.xmlfragment(that.getView().getId(),
					sPath, {
						onOKPressed: function () {
							if (fnMergeRequestBatch) {
								fnMergeRequestBatch();
							}
							oParameterDialog.close();
						},
						afterClose: function () {
							oParameterDialog.destroy();
						}
					}
				);
				return oParameterDialog;
			},

			_fnGetPopUpFragment: function _fnGetPopUpFragment(sCtrl, bLimit) {
				var oFrag = {
					sFragPath: undefined,
					sMsgStripId: undefined
				};

				if (bLimit) {
					sCtrl = undefined;
				}
				switch (sCtrl) {
				case "SalesDocumentRjcnReason":
					oFrag.sFragPath = "cus.sd.lib.worklist.ext.fragments.CustomActionPopUpRejectAllItems";
					oFrag.sMsgStripId = "rejectAllItemsMessageStrip";
					break;
				case "DeliveryBlockReason":
					oFrag.sFragPath = "cus.sd.lib.worklist.ext.fragments.CustomActionPopUpSetDeliveryBlock";
					oFrag.sMsgStripId = "setDeliveryBlockMessageStrip";
					break;
				case "HeaderBillingBlockReason":
					oFrag.sFragPath = "cus.sd.lib.worklist.ext.fragments.CustomActionPopUpSetBillingBlock";
					oFrag.sMsgStripId = "setBillingBlockMessageStrip";
					break;
				case "SDDocumentReason":
					oFrag.sFragPath = "cus.sd.lib.worklist.ext.fragments.CustomActionPopUpSetOrderReason";
					oFrag.sMsgStripId = "setOrderReasonMessageStrip";
					break;
				default:
					oFrag.sFragPath = "cus.sd.lib.worklist.ext.fragments.CustomActionSingleMessagePopUp";
					oFrag.sMsgStripId = "singleErrorMessageStripForActions";
				}
				return oFrag;
			},

			_mergeRequestBatch: function (self, selectedItems, mergeData, oParameterDialog, fnGetStrip, oExtensionAPI,
				fnRemoveSelection, sSrvUrl) {
				var that = this;
				var oModel;

				if (sSrvUrl) {
					oModel = new sap.ui.model.odata.ODataModel(sSrvUrl, true);
				} else {
					oModel = new sap.ui.model.odata.ODataModel(this.oView.getModel().sServiceUrl, true);
				}

				oModel.setUseBatch(true);
				oModel.setHeaders(this.oView.getModel().getHeaders());

				for (var zl = 0; zl < selectedItems.length; zl++) {
					var changeSetOperationsForActualOrder = new Array();
					var path = selectedItems[zl].altPath ? selectedItems[zl].altPath : selectedItems[zl].path;

					if (selectedItems[zl].etag) {
						changeSetOperationsForActualOrder.push(oModel.createBatchOperation(path, "MERGE", mergeData, {
							sETag: selectedItems[zl].etag
						}));
					} else {
						//for consumer without etag
						changeSetOperationsForActualOrder.push(oModel.createBatchOperation(path, "MERGE", mergeData));
					}

					// one change set for each sales order with one operations for each change set
					oModel.addBatchChangeOperations(changeSetOperationsForActualOrder);
				}
				var mParameters = {
					"sActionLabel": this.i18nReuseLib.getResourceBundle().getText(this.actionI18NKey)
				};
				var oRequestPromise = oExtensionAPI.securedExecution(function () {
					return new Promise(function (fnResolve, fnReject) {
						oModel.submitBatch(function (data) {
							fnResolve(data);
						}, function (err) {
							fnReject(err);
						});
					});
				}, mParameters);
				oRequestPromise.then(function (data) {
					if (oParameterDialog) {
						oParameterDialog.close();
					}
					fnRemoveSelection();
					if (oExtensionAPI.refresh) {
						oExtensionAPI.refresh();
					} else {
						oExtensionAPI.refreshTable();
					}
					self._fillMessageManager(that, data, selectedItems);
				}, function (err) {
					if (oParameterDialog) {
						self._messageOnFailure(that, err, fnGetStrip);
						self._fnToggleEnableButtons(self.oParameterDialog.getButtons());
						self.oParameterDialog.setBusy(false);
					} else {
						var oErrorDialog = self._fnGetActionWithoutInputDialogMassChange(that);
						oErrorDialog.setModel(that.i18nReuseLib, "i18n");
						self._messageOnFailure(that, err, fnGetStrip);
						oErrorDialog.open();
					}
				});
			},

			_fillMessageManager: function (that, data, selectedItems) {
				var oMessageManager = sap.ui.getCore().getMessageManager();
				var oMessage;
				var severity;

				if (data) {
					if (data.__batchResponses) {
						for (var zl = 0; zl < data.__batchResponses.length; zl++) {
							var responses = data.__batchResponses[zl].__changeResponses;
							if (data.__batchResponses[zl].response && (data.__batchResponses[zl].response.statusCode.startsWith("4") || data.__batchResponses[
									zl].response.startsWith("5"))) {

								var errResponse = JSON.parse(data.__batchResponses[zl].response.body).error;
								var innerError = errResponse.innererror;

								if (innerError && innerError.errordetails) {
									for (var zm = 0; zm < innerError.errordetails.length; zm++) {
										oMessage = this._createMsg(innerError.errordetails[zm].message, innerError.errordetails[zm].severity, selectedItems[zl].path);
										oMessageManager.addMessages(oMessage);
									}
								} else {
									oMessage = this._createMsg(errResponse.message.value, "error", selectedItems[zl].path);
									oMessageManager.addMessages(oMessage);
								}
							} else if (responses) {
								var responseHeader = responses[0].headers;
								var msg;

								if (responseHeader["sap-message"]) {
									responseHeader = JSON.parse(responseHeader["sap-message"]);
									msg = responseHeader.message;
									severity = responseHeader.severity;
								}
								oMessage = this._createMsg(msg, severity, selectedItems[zl].path);
								oMessageManager.addMessages(oMessage);
							}
						}
					}
				}
			},

			_createMsg: function (text, severity, path) {
				var oMessage = new sap.ui.core.message.Message({
					message: text,
					persistent: true,
					type: this._messageTypes[severity],
					target: path
				});

				return oMessage;
			},

			_messageTypes: {
				"error": sap.ui.core.MessageType.Error,
				"warning": sap.ui.core.MessageType.Warning,
				"info": sap.ui.core.MessageType.Success
			},

			_sortMessages: function (aMessages) {
				aMessages.sort(function (x, z) {
					var xType = x.type.toLowerCase();
					var zType = z.type.toLowerCase();

					if (xType < zType) {
						return -1;
					} else if (xType > zType) {
						return 1;
					} else {
						return 0;
					}
				});
			},

			_getMessageForMassChangeActions: function _getMessageForMassChangeActions(fnGetStrip, sMsgText, sSeverity) {
				var oMsgCtrl = fnGetStrip(this);
				oMsgCtrl.setType(sSeverity);
				oMsgCtrl.setVisible(true);
				oMsgCtrl.setText(sMsgText);
			},

			//****** Process Flow Integration *******//

			onPressOverallStatus: function (oEvent, fragPath, businessObject) {
				var oProcessFlowData = {};
				var processFlowDocument = businessObject.processFlowDocument;

				var path = oEvent.getSource().getBindingContext().sPath;
				var oDocument = this.getView().getModel().getProperty(path);

				oProcessFlowData[processFlowDocument] = oDocument[businessObject.documentTyp];
				oProcessFlowData.id = "PFComponent";
				
				if (oDocument.SoldToPartyName) {
					var soldToPartyName = oDocument["SoldToPartyName"];
				} else if (oDocument.CustomerName) {
					soldToPartyName = oDocument["CustomerName"]; 
				} else if (oDocument.to_SoldToParty) {
					//read by association
					soldToPartyName = this.getView().getModel().getProperty("/" + oDocument.to_SoldToParty.__ref).CustomerName;
				} else {
					//read from customer360 root
					var oBindingContext = oEvent.getSource().getParent().getParent().getBindingContext(); 	
					if 	(oBindingContext) {
						var sPath = oBindingContext.sPath; 
						soldToPartyName = this.getView().getModel().getProperty(sPath).CustomerName;
					}	
				}

				var BO = this.getView().getModel("i18n").getProperty(businessObject.documentTyp);
				var oUIModel = new sap.ui.model.json.JSONModel({
					settings: oProcessFlowData
				});

				var procDocId = oProcessFlowData[processFlowDocument];

				var oParameterDialog = this.util._fnGetProcFlowDialog.call(this, soldToPartyName, fragPath, BO, procDocId);
				oParameterDialog.setModel(oUIModel, "UIModel");
				this.extensionAPI.attachToView(oParameterDialog);
				oParameterDialog.open();
			},

			_fnGetProcFlowDialog: function _fnGetProcFlowDialog(soldToParty, fragPath, BO, procDocId) {
				var oParameterDialog = sap.ui.xmlfragment(this.getView().getId(),
					fragPath, {
						onOKPressed: function () {
							oParameterDialog.close();
						},
						afterClose: function () {
							oParameterDialog.destroy();
						},
						beforeOpen: function () {
							var sTitle = soldToParty ? soldToParty + " / " + BO + " " + procDocId : BO + " " + procDocId;
							oParameterDialog.setTitle(sTitle);
						}
					}
				);
				return oParameterDialog;
			},

			//****** Subsequent Document Processing *******//

			onCreateSubsequentDocument: function onCreateSubsequentDocument(that, salesDocNum, targetObjSubsequentDocument, fragPath, fnGetStrip,
				i18nPath) {
				var self = this;
				var orderTypeKey;
				var sPath = that.extensionAPI.getSelectedContexts()[0].sPath;

				var oParameterDialog = sap.ui.xmlfragment(that.getView().getId(),
					fragPath, {
						onOKPressed: function () {
							var orderType = orderTypeKey;
							if (orderType === "" || orderType === undefined) {
								self._messageOnInvalidDoc(that, fnGetStrip, i18nPath);
								return;
							}
							var params = {
								SalesOrderType: orderType,
								ReferenceSDDocument: salesDocNum
							};
							self.onPressCreateBase.call(self, targetObjSubsequentDocument, params);
							oParameterDialog.close();
						},
						afterClose: function () {
							oParameterDialog.destroy();
						},
						beforeOpen: function () {},
						onCancelPressed: function () {
							oParameterDialog.close();
						},
						onChangeDDSubsequentDoc: function (oEvent) {
							orderTypeKey = oEvent.getSource().getProperty("selectedKey");
						}
					}
				);

				that.extensionAPI.attachToView(oParameterDialog);
				oParameterDialog.bindElement({
					path: sPath,
					parameters: {
						expand: 'to_SubsequentDocType/to_TargetSalesDocumentType'
					}
				});
				oParameterDialog.open();
			},

			//****** External Navigation *******//

			onPressCreateBase: function onPressCreateBase(targetObject, parameters) {
				var fgetService = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService;
				this.oCrossAppNavigator = fgetService && fgetService("CrossApplicationNavigation");
				if (this.oCrossAppNavigator) {
					this.oCrossAppNavigator.toExternal({
						target: {
							semanticObject: targetObject.semanticObject,
							action: targetObject.createSemanticAction
						},
						params: parameters
					});
				}
			},

			onPressManageBase: function onPressManageBase(targetObject, parameters) {
				var fgetService = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService;
				this.oCrossAppNavigator = fgetService && fgetService("CrossApplicationNavigation");
				if (this.oCrossAppNavigator) {
					this.oCrossAppNavigator.toExternal({
						target: {
							semanticObject: targetObject.semanticObject,
							action: targetObject.manageSemanticAction
						},
						params: parameters
					});
				}
			},

			/**	Functions for analitical tables for quick actions */
			/**
			 * Get the update context for an analytical table
			 *
			 * @param {sap.ui.table.AnalyticalTable} oTable The analytical table with selected rows.
			 * @param {array} aUpdateKeys The array of key properties needed for the update.
			 * @return {array} Array of objects with the proberty path as string.
			 */
			getUpdateContextAnalyticalTable: function (oTable, aUpdateKeys) {

				var iCount;
				var aUpdateContext = [];

				var aSelectedRows = this._getSelectedRowsAnalyticalTable(oTable);

				// delete duplicates keys
				aSelectedRows = this._deleteDublicatesCompering(aSelectedRows, aUpdateKeys);

				for (iCount = 0; iCount < aSelectedRows.length; iCount++) {
					aUpdateContext.push({
						path: aSelectedRows[iCount].getPath()
					});
				}

				return aUpdateContext;
			},

			/**
			 * Get the selected rows from an analytical table
			 *
			 * @param {sap.ui.table.AnalyticalTable} oTable The table where the rows are selected.
			 * @return {array} Array of selected rows with datatype "sap.ui.table.Row".
			 */
			_getSelectedRowsAnalyticalTable: function (oTable) {
				var iCount;
				var aSelectedIndices;
				var oSelectionPlugin = oTable._getSelectionPlugin();

				if (oSelectionPlugin) {
					aSelectedIndices = oSelectionPlugin.getSelectedIndices();
				} else {
					aSelectedIndices = oTable.getSelectedIndices();
				}
				var aSelectedRows = [];
				for (iCount = 0; iCount < aSelectedIndices.length; iCount++) {
					aSelectedRows.push(oTable.getContextByIndex(aSelectedIndices[iCount]));
				}
				return aSelectedRows;
			},

			/**
			 * No duplicates keys for update
			 *
			 * @param {sap.ui.table.Row} aRows The rows to compare.
			 * @param {array} aKeys Array with properties as string for comparison ($select).
			 * @return {array} An array of rows without dublicates.
			 */
			_deleteDublicatesCompering: function (aRows, aKeys) {
				var iCounter;
				var iReturnCounter;
				var aReturnRows = [];
				var bFound;
				var oCompare;
				var oReturnCompare;
				// it is the same model for all rows!
				var oModel = aRows[0].getModel();

				for (iCounter = 0; iCounter < aRows.length; iCounter++) {
					bFound = false;
					oCompare = this._createObjectToCompare(oModel.getProperty(aRows[iCounter].getPath()), aKeys);
					if (aReturnRows.length === 0) {
						aReturnRows.push(aRows[iCounter]);
					} else {
						for (iReturnCounter = 0; iReturnCounter < aReturnRows.length; iReturnCounter++) {
							oReturnCompare = this._createObjectToCompare(oModel.getProperty(aReturnRows[iReturnCounter].getPath()), aKeys);
							if (this._compareObjectAttributesByKeys(oCompare, oReturnCompare, aKeys)) {
								bFound = true;
								iReturnCounter = aReturnRows.length;
							}
						}
						if (bFound === false) {
							aReturnRows.push(aRows[iCounter]);
						}
					}
				}
				return aReturnRows;
			},

			/**
			 * Compares two javascript objects by the given keys
			 *
			 * @param {object} oToCompare1 The first object for the comparison.
			 * @param {object} oToCompare2 The second object for the comparison.
			 * @param {array} aKeys The array with attributes for comparison.
			 * @return {booleans} The result of the comparison as boolean (equal = true).
			 */
			_compareObjectAttributesByKeys: function (oToCompare1, oToCompare2, aKeys) {
				var iIsEqual = 0;
				var bIsEqual = false;

				for (var iEqualCounter = 0; iEqualCounter < aKeys.length; iEqualCounter++) {
					if (oToCompare1[aKeys[iEqualCounter]] === oToCompare2[aKeys[iEqualCounter]]) {
						iIsEqual = iIsEqual + 1;
					}
				}
				if (aKeys.length === iIsEqual) {
					bIsEqual = true;
				}
				return bIsEqual;
			},

			/**
			 * Creates a javascript object with the given keys as attribut and
			 * the values from properties.
			 *
			 * @param {object} oProperties The properties with the values for the new object.
			 * @param {array} aKeys The array with the attributes for the new object.
			 * @return {object} The object with the given keys as attribut.
			 */
			_createObjectToCompare: function (oProperties, aKeys) {
				var iCompareCounter;
				var oToCompare = {};
				for (iCompareCounter = 0; iCompareCounter < aKeys.length; iCompareCounter++) {
					oToCompare[aKeys[iCompareCounter]] = oProperties[aKeys[iCompareCounter]];
				}
				return oToCompare;
			}
		});
	});

//# sourceURL=https://my304870.s4hana.ondemand.com/sap/bc/ui5_ui5/sap/sd_reuse_wkls1/~4D0397DE4B10B7B9ADBF874D8305B28E~5/util/UtilityHelper-dbg.js?eval
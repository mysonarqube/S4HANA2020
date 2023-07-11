/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/model/resource/ResourceModel",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function (ResourceModel, JSONModel, MessageBox) {
	"use strict";

	return {

		/**
		 * init and opens the "Edit time for Operation Activity" dialog
		 * 
		 * @param {object}	oView - main view 
		 * @param {object}	oOperationActyContexts - An object that holds SelectedContext of all selected OAs
		 * @param {function} fnCallBackOnSave - function that will be fired after the dialog is closed. After pressing Save. Signature function (oEve)
		 * @param {function} fnCallBackOnCancel - function that will be fired after the dialog is closed. After pressing cancel. Signature function (oEve)
		 * @private
		 */
		_initAndOpenEditTimeForOADialog: function (oView, oOperationActyContexts, fnCallBackOnSave, fnCallBackOnCancel ) {
			
			this.oView = oView;
			this.oOperationActyContexts = oOperationActyContexts;
			this.fnCallBackOnSave = fnCallBackOnSave;
			this.fnCallBackOnCancel = fnCallBackOnCancel;
			
			// create upload dialog if not existing yet
			if (!this._oEditTimeForOADialog) {
				this._oEditTimeForOADialog = sap.ui.xmlfragment("i2d.mpe.workassign.manages1.ext.fragment.EditTimeForOADialog", this);
				this._oEditTimeForOADialog.setModel(oView.getModel("i18n"), "i18n");
				//this.getView().addDependent(this._oEditTimeForOADialog);
			}

			//set dialog to initial state
			sap.ui.getCore().byId("idEditTimeForOADialogSaveButtonText").setEnabled(true);
			sap.ui.getCore().byId("inputTime").setValueState(sap.ui.core.ValueState.None);
			sap.ui.getCore().byId("inputTime").setValue("");
			
			var laborTrackingStatus = this.checkLaborTrackingOfAllSelectedOAs(this.oOperationActyContexts);
	
			//"0" if for all OAs bLaborTrackingIsRequired is false;
			if (laborTrackingStatus === 0) {
				sap.ui.getCore().byId("idTargetTimeLable").setText(this.oView.getModel("i18n").getResourceBundle().getText("TargetOATime"));
				//"1" if for all OAs bLaborTrackingIsRequired === false; 	
			} else if (laborTrackingStatus === 1) {
				sap.ui.getCore().byId("idTargetTimeLable").setText(this.oView.getModel("i18n").getResourceBundle().getText("TargetLaborTime"));
				//"2" if we have a mixture of OAs where Labor Tracking Is Required and Labor Tracking Is Not Required;
			} else if (laborTrackingStatus === 2) {
				sap.ui.getCore().byId("idTargetTimeLable").setText(this.oView.getModel("i18n").getResourceBundle().getText(
					"TargetOATargetLaborTime"));
			}
	
			this._oEditTimeForOADialog.open();
		},
		
		/**
		 * LiveChange- Fired when the user changes the value of the 'inputTime' field
		 * @param {sap.ui.base.Event} oEvent - An Event object consisting of an ID, a source and a map of parameters.
		 */
		onEditTimeForOADialogLiveChange: function (oEvent){
			
			//Validates the entered value
			if( Number( oEvent.getParameter("newValue")) > 9999 ){
				oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
				sap.ui.getCore().byId("idEditTimeForOADialogSaveButtonText").setEnabled(false);
			} else if( Number( oEvent.getParameter("newValue")) < 0  ){
				oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
				sap.ui.getCore().byId("idEditTimeForOADialogSaveButtonText").setEnabled(false);
			}else{
				oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
				sap.ui.getCore().byId("idEditTimeForOADialogSaveButtonText").setEnabled(true);
			}
		},
	
		/**
		 * Closes the "Edit time for Operation Activity" dialog
		 * Fired when the user clicks or taps on the "Cancel" Button of the "Edit time for Operation Activity" dialog.
		 * @param {sap.ui.base.Event} oControlEvent - An Event object consisting of an ID, a source and a map of parameters.  
		 */
		onEditTimeForOADialogCancel: function (oEvent) {
			this._oEditTimeForOADialog.close();
			if(this.fnCallBackOnCancel){
				this.fnCallBackOnCancel(oEvent);
			}
		},
	
		/**
		 * Fired when the user clicks or taps on the "Save" Button of the "Edit time for Operation Activity" dialog.
		 * @param {sap.ui.base.Event} oControlEvent - An Event object consisting of an ID, a source and a map of parameters.  
		 */
		onEditTimeForOADialogSaveTime: function (oEvent) {
			var iTimeInSec = 0;

			 var isPositiveInteger = function(str) {
			    var n = Math.floor(Number(str));
			    return n !== Infinity && String(n) === str && n >= 0;
			};
			
			if(isPositiveInteger(sap.ui.getCore().byId("inputTime").getValue())){	
		
				switch (sap.ui.getCore().byId("selectTimeUnit").getSelectedKey()) {
				case "S":
					iTimeInSec = sap.ui.getCore().byId("inputTime").getValue();
					break;
				case "MIN":
					iTimeInSec = sap.ui.getCore().byId("inputTime").getValue() * 60;
					break;
				case "HOUR":
					iTimeInSec = sap.ui.getCore().byId("inputTime").getValue() * 3600;
					break;
				case "DAY":
					iTimeInSec = sap.ui.getCore().byId("inputTime").getValue() * 86400;
					break;
				default:
					iTimeInSec = sap.ui.getCore().byId("inputTime").getValue();
					break;
				}
				this.functionImportEditTargetTime(this.oOperationActyContexts, iTimeInSec, true); // call the function import 
				
				if(this.fnCallBackOnSave){
					this.fnCallBackOnSave(oEvent);
				}
			}else{
				MessageBox.error(this.oView.getModel("i18n").getResourceBundle().getText("EnterValidTimeMessage"));
			}
		},
	
		/**
		 * This method calls the functionImport to change the target time for the selcted OAs.
		 * 
		 * @param {object}	oOperationActyContexts - An object that holds SelectedContext of all selected OAs
		 * @param {integer}	iTimeInSec - The in secounds that should applay for all operation activies
		 * @param {integer}	bShowSuccessMessage - True if a success message should came up otherwise false
		 */
		functionImportEditTargetTime: function (oOperationActyContexts, iTimeInSec, bShowSuccessMessage) {
			var that = this;
			var bShowSuccessToast = bShowSuccessMessage;
			var sGroup = jQuery.sap.uid(); // create an id under which the batch call will be executed
			this.oView.getModel().setDeferredGroups([sGroup]);
	
			that._oEditTimeForOADialog.setBusy(true);
	
			oOperationActyContexts.forEach(function (oOAContext, index, arr) {
				var oOA = oOAContext.getObject();
				that.oView.getModel().callFunction("/C_ProcgExecOpActyInstceTPExpd_exec_durn", // function import name
					{
						groupId: sGroup,
						method: "POST", // http method
						urlParameters: {
							"OpActyNtwkInstance": oOA.OpActyNtwkInstance,
							"OpActyNtwkElement": oOA.OpActyNtwkElement,
							"ExpdExecDurn": iTimeInSec
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
													id: "backEndErrorMessageBox",
													title: that.oView.getModel("i18n").getResourceBundle().getText("TimeAssignmentErrorMessage"),
													actions: [sap.m.MessageBox.Action.CLOSE],
													onClose: function () {
														this._bMessageOpen = false;
													}.bind(this)
												});
										}
									} catch (error) {
										sap.m.MessageToast.show(that.oView.getModel("i18n").getResourceBundle().getText("TimeAssignmentErrorMessage"));
									}
								}
								bShowSuccessToast = false;
							} // callback function for error
					}
				);
			});
	
			//Submits the collected changes | do the batch call
			this.oView.getModel().submitChanges({
				groupId: sGroup,
				success: function (oData) {
					if (bShowSuccessToast) {
						sap.m.MessageToast.show(that.oView.getModel("i18n").getResourceBundle().getText("TimeAssignmentSuccessToast"));
					}
					that.oView.getModel().refresh(true);
					that._oEditTimeForOADialog.setBusy(false);
					that._oEditTimeForOADialog.close();
				},
				error: function (oError) {
					that.oView.getModel().refresh(true);
					that._oEditTimeForOADialog.setBusy(false);
					that._oEditTimeForOADialog.close();
					jQuery.sap.log.error(oError.responseText);
				}
			});
		},
		
			
		/**
		 * Checks Labor Tracking of all OAs and returns an overall status of them. Whether Labor Tracking is required for all of them or non. Or if an mix exists OAs whre Labor racking is required and other where it is not.
		 * @param {object}	oOperationActyContexts - An object that holds SelectedContext of all selected OAs
		 * 
		 * @returns {number} "0" if for all OAs bLaborTrackingIsRequired === false; "1" if for all OAs bLaborTrackingIsRequired === false; "2" if we have a mixture of OAs where Labor Tracking Is Required and Labor Tracking Is Not Required;
		 */
		checkLaborTrackingOfAllSelectedOAs: function (oOperationActyContexts) {
			var ibLaborTracking = 0;
			var bLaborTrackingIsRequired = undefined;
			oOperationActyContexts.forEach(function (oOAContext, index, arr) {
				var oOA = oOAContext.getObject();
	
				if (bLaborTrackingIsRequired === undefined) {
					bLaborTrackingIsRequired = oOA.LaborTrackingIsRequired; // take the value of the first one
					ibLaborTracking = bLaborTrackingIsRequired ? 1 : 0;
				} else {
					//if one of the next ones is different then the ones we already have checked, than we have a mixture of OAs where Labor Tracking Is Required and Labor Tracking Is Not Required
					if (bLaborTrackingIsRequired !== oOA.LaborTrackingIsRequired) {
						ibLaborTracking = 2;
						return ibLaborTracking;
					}
				}
			});
			return ibLaborTracking;
		}
	};
});
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

		initAndOpen: function (oView, oAssignedActivitySelectedItem) {
			this._oView = oView;
			this.oAssignedActivitySelectedItem = oAssignedActivitySelectedItem;
			
			if (!this.oChangePriorityDialog) {
				this.oChangePriorityDialog = sap.ui.xmlfragment("ChangePriority", "i2d.mpe.workassign.manages1.ext.fragment.ChangePriorityDialog", this);
				this.oChangePriorityDialog.setModel(oView.getModel("i18n"), "i18n");
			}
	
			var sPriority = oAssignedActivitySelectedItem.MfgOpActyExecutionPriority;
			sap.ui.getCore().byId(sap.ui.core.Fragment.createId("ChangePriority", "idPriority")).setValue(sPriority);
			sap.ui.getCore().byId(sap.ui.core.Fragment.createId("ChangePriority", "idPrioritySave")).setEnabled(true);
			this.oChangePriorityDialog.open();
			
			return this.oChangePriorityDialog;
		},
		
		/**
		 * Fired when the user clicks on the "Cancel" Button in Priority Dialog
		 * @param {sap.ui.base.Event} oEvent - An Event object consisting of an ID, a source and a map of parameters.
		 */
		onChangePriorityDialogCancel: function (oEvent) {
			this.oChangePriorityDialog.close();
		},
		
		/**
		 * Fired when the user clicks on the "Cancel" Button in Priority Dialog
		 * @param {sap.ui.base.Event} oEvent - An Event object consisting of an ID, a source and a map of parameters.
		 */
		onChangePriorityDialogSave: function (oEvent) {
			var sPriority = sap.ui.getCore().byId(sap.ui.core.Fragment.createId("ChangePriority", "idPriority")).getValue();
			this._updatePriority(this.oAssignedActivitySelectedItem, sPriority);
		},
		
		onPriorityChange: function (oEvent) {
			if( oEvent.getParameter("value") > 32767 || oEvent.getParameter("value") < 0){
				sap.ui.getCore().byId(sap.ui.core.Fragment.createId("ChangePriority", "idPrioritySave")).setEnabled(false);
			}else{
				sap.ui.getCore().byId(sap.ui.core.Fragment.createId("ChangePriority", "idPrioritySave")).setEnabled(true);
			}
		},
		
		/**
		 * Updates the Priority of an activity that is assgined to a user
		 * 
		 * @param {Object} oAssignedActivity - An activity that is assgined to a user to which the new Priority shall be applayed on      
		 * @param {String} sPriority - New priority for the activity 
		 */ 
		_updatePriority: function (oAssignedActivity, sPriority) {
			var that = this;
			var oModel = this._oView.getModel();
			var oTable = sap.ui.getCore().byId("assignmentsTable");
			sap.ui.core.BusyIndicator.show();
			oModel.callFunction("/C_OpActyUserAssgmtTPSet_exec_prio", {
				method: "POST",
				urlParameters: {
					"OpActyNtwkElement": oAssignedActivity.OpActyNtwkElement,
					"OpActyNtwkInstance": oAssignedActivity.OpActyNtwkInstance,
					"UserID": oAssignedActivity.UserID,
					"OaExecPrio": sPriority
				},
				success: function (oData, response) {
					if (that.oChangePriorityDialog) {
						that.oChangePriorityDialog.close();
					}
					sap.ui.core.BusyIndicator.hide();
					oTable.getBinding("items").refresh();
					sap.m.MessageToast.show(JSON.parse(response.headers["sap-message"]).message);
					oTable.removeSelections();
					sap.ui.getCore().byId("changePriorityButton").setEnabled(false);
				},
				error: function (oError) {
					var sResponseText = oError.responseText;
					if (sResponseText !== undefined) {
						oTable.removeSelections();
						sap.ui.getCore().byId("changePriorityButton").setEnabled(false);
						var sMsg = JSON.parse(sResponseText).error.message.value;
						sap.ui.core.BusyIndicator.hide();
						sap.m.MessageBox.error(
							sMsg, {
								actions: [sap.m.MessageBox.Action.CLOSE]
							});
					}
				}
			});
		}
	};
});
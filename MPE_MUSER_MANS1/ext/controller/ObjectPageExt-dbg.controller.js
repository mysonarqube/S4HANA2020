/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.controller("i2d.mpe.mfguser.manages1.ext.controller.ObjectPageExt", {

	onBeforeRebindTableExtension: function (oEvent) {
		this.getView().getModel().refresh(true);
	},

	onClickUserWCAddButton: function (oEvent) {
		if (!this.AddWorkCenterAssignmentDialog) {
			this.AddWorkCenterAssignmentDialog = sap.ui.xmlfragment("AddWorkCenterAssignmentDialog",
				"i2d.mpe.mfguser.manages1.ext.fragment.AddWorkCenterAssignment", this);
			this.getView().addDependent(this.AddWorkCenterAssignmentDialog);
			this.AddWorkCenterAssignmentDialog.setModel(this.getOwnerComponent().getModel('i18n'), "i18n");
		}
		var oContext = this.getView().getModel().createEntry(this.getOwnerComponent().getBindingContext().getPath() + "/to_MfgBPWrkCtr", {
			groupId: "Changes",
			changeSetId: "Changes",
			batchGroupId: "Changes"
		}, {
			success: $.proxy(function (Data) {}, this),
			error: jQuery.proxy(function (oError) {
				var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
				this.getView().setBusy(false);
				sap.m.MessageBox.error(
					JSON.parse(oError.responseText).error.message.value, {
						styleClass: bCompact ? "sapUiSizeCompact" : ""
					}
				);
			}, this)
		});
		if (oContext) {
			this.AddWorkCenterAssignmentDialog.setBindingContext(oContext);
			this.AddWorkCenterAssignmentDialog.open();
			var curDate = new Date();
			sap.ui.getCore().byId(sap.ui.core.Fragment.createId("AddWorkCenterAssignmentDialog", "ValidityStartDate")).setValue(curDate);
			// var lastDateUTC = new Date(Date.UTC(9999, 11, 31));
			var lastDate = new Date();
			lastDate.setYear("9999");
			lastDate.setMonth("11");
			lastDate.setDate("31");
			sap.ui.getCore().byId(sap.ui.core.Fragment.createId("AddWorkCenterAssignmentDialog", "ValidityEndDate")).setValue(lastDate);
		}
	},

	onValueChange: function (oEvent) {
		var source = oEvent.getSource();
		var sPath = source._getBindingContext().getPath();
		var bindingInfo = source.getBindingInfo("value");
		var path = bindingInfo.parts[0].path;
		var newValue = oEvent.getParameters().newValue;
		if (path === "WorkCenter" || path === "Plant") {
			this.getOwnerComponent().getModel().setProperty("" + sPath + "/" + path + "", newValue);
			var WorkCenter = sap.ui.getCore().byId(sap.ui.core.Fragment.createId("AddWorkCenterAssignmentDialog", "WorkCenter"));
			var Plant = sap.ui.getCore().byId(sap.ui.core.Fragment.createId("AddWorkCenterAssignmentDialog", "Plant"));
			WorkCenter.setValueState(sap.ui.core.ValueState.None);
			Plant.setValueState(sap.ui.core.ValueState.None);
		} else if (path === "MfgQualifnCertExprtnDate" && newValue === "") {
			this.getOwnerComponent().getModel().setProperty("" + sPath + "/" + path + "", undefined);
		}

	},
	onDefaultChange: function (oEvent) {
		var oEndDate = sap.ui.getCore().byId(sap.ui.core.Fragment.createId("EditWCAssignmentDialog", "ValidityEndDate"));
		oEndDate.setValueState(sap.ui.core.ValueState.None);
	},

	onCreateWCOKPress: function (oEvent) {
		var valueStateWorkCenter = sap.ui.getCore().byId(sap.ui.core.Fragment.createId("AddWorkCenterAssignmentDialog", "WorkCenter")).getValueState();
		var valueStatePlant = sap.ui.getCore().byId(sap.ui.core.Fragment.createId("AddWorkCenterAssignmentDialog", "Plant")).getValueState();
		var valueStateStartDate = sap.ui.getCore().byId(sap.ui.core.Fragment.createId("AddWorkCenterAssignmentDialog", "ValidityStartDate")).getValueState();
		var valueStateEndDate = sap.ui.getCore().byId(sap.ui.core.Fragment.createId("AddWorkCenterAssignmentDialog", "ValidityEndDate")).getValueState();
		if (valueStateStartDate === "None" && valueStateEndDate === "None") {
			var sPath = this.AddWorkCenterAssignmentDialog.getBindingContext().getPath();
			var workCenter = this.getOwnerComponent().getModel().getProperty(sPath).WorkCenter;
			var plant = this.getOwnerComponent().getModel().getProperty(sPath).Plant;
			// var parentPath = this.getView().getBindingContext().getPath();
			// var parentObject = this.getOwnerComponent().getModel().getProperty(parentPath);
			// var MfgBusinessPartner = parentObject.MfgBusinessPartner;
			var MfgBusinessPartner = this.getView().getBindingContext().getProperty("MfgBusinessPartner");
			this.getOwnerComponent().getModel().setProperty("" + sPath + "/MfgBusinessPartner", MfgBusinessPartner);
			if (plant === undefined){
				var ErrorMSG = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("EnterPlant");
				sap.ui.getCore().byId(sap.ui.core.Fragment.createId("AddWorkCenterAssignmentDialog", "Plant")).setValueState(sap.ui.core.ValueState
					.Error);
				sap.m.MessageToast.show(ErrorMSG);
				this.AddWorkCenterAssignmentDialog.setBusy(false);
			} 
			if (workCenter === undefined){
				ErrorMSG = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("EnterWC");
				sap.ui.getCore().byId(sap.ui.core.Fragment.createId("AddWorkCenterAssignmentDialog", "WorkCenter")).setValueState(sap.ui.core.ValueState
					.Error);
				sap.m.MessageToast.show(ErrorMSG);
				this.AddWorkCenterAssignmentDialog.setBusy(false);
			}
			if(valueStateWorkCenter === "None" && valueStatePlant === "None"){
			if (workCenter.length > 8) {
				ErrorMSG = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("workCenterTooLong");
				sap.ui.getCore().byId(sap.ui.core.Fragment.createId("AddWorkCenterAssignmentDialog", "WorkCenter")).setValueState(sap.ui.core.ValueState
					.Error);
				sap.m.MessageToast.show(ErrorMSG);
				this.AddWorkCenterAssignmentDialog.setBusy(false);
			} else if (plant.length > 4) {
				ErrorMSG = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("plantTooLong");
				sap.ui.getCore().byId(sap.ui.core.Fragment.createId("AddWorkCenterAssignmentDialog", "Plant")).setValueState(sap.ui.core.ValueState
					.Error);
				sap.m.MessageToast.show(ErrorMSG);
				this.AddWorkCenterAssignmentDialog.setBusy(false);
			} else {
				var pendingChanges = this.getOwnerComponent().getModel().hasPendingChanges();
				if (pendingChanges === true) {
					this.getOwnerComponent().getModel().submitChanges({
						success: jQuery.proxy(function (data) {
							var response = data.__batchResponses[data.__batchResponses.length - 1];
							var responseKeys = Object.keys(response);
							var check = false;
							for (var i in responseKeys) {
								if (responseKeys[i] === "__changeResponses") {
									check = true;
								}
							}
							if (check) {
								if (response.__changeResponses[response.__changeResponses.length - 1].statusCode === "201") {
									var WCAddSuccessMsg = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(
										"WCAddSuccessMsg", [
											response.__changeResponses[response.__changeResponses.length - 1].data.WorkCenter
										]);
									sap.m.MessageToast.show(WCAddSuccessMsg);
									this.getOwnerComponent().getModel().refresh(true);
									this.getOwnerComponent().getModel().resetChanges();
									this.AddWorkCenterAssignmentDialog.close();
								}
							} else {
								var responseBody = data.__batchResponses[0].response.body;
								var responseJSON = JSON.parse(responseBody);
								var ErrorMSG = responseJSON.error.message.value;
								var ValidToSmartField = sap.ui.getCore().byId(sap.ui.core.Fragment.createId("AddWorkCenterAssignmentDialog",
									"ValidityEndDate"));
								var WCSmartField = sap.ui.getCore().byId(sap.ui.core.Fragment.createId("AddWorkCenterAssignmentDialog", "WorkCenter"));
								var ValidFromSmartField = sap.ui.getCore().byId(sap.ui.core.Fragment.createId("AddWorkCenterAssignmentDialog",
									"ValidityStartDate"));
								var PlantSmartField = sap.ui.getCore().byId(sap.ui.core.Fragment.createId("AddWorkCenterAssignmentDialog", "Plant"));
								if (responseJSON.error.code === "MPE_USER_GROUP_MSGS/028" || responseJSON.error.code === "MPE_USER_GROUP_MSGS/030" ||
									responseJSON.error.code === "MPE_USER_GROUP_MSGS/031" || responseJSON.error.code === "MPE_USER_GROUP_MSGS/034") {
									ValidToSmartField.setValueState(sap.ui.core.ValueState.Error);
									ValidToSmartField.setValueStateText(ErrorMSG);
								} else if (responseJSON.error.code === "MPE_USER_GROUP_MSGS/033" || responseJSON.error.code === "MPE_USER_GROUP_MSGS/007" ||
									responseJSON.error.code === "MPE_USER_GROUP_MSGS/008" || responseJSON.error.code === "MPE_USER_GROUP_MSGS/035") {
									WCSmartField.setValueState(sap.ui.core.ValueState.Error);
									WCSmartField.setValueStateText(ErrorMSG);
								} else if (responseJSON.error.code === "MPE_USER_GROUP_MSGS/025") {
									WCSmartField.setValueState(sap.ui.core.ValueState.Error);
									PlantSmartField.setValueState(sap.ui.core.ValueState.Error);
									WCSmartField.setValueStateText(ErrorMSG);
									PlantSmartField.setValueStateText(ErrorMSG);
								} else if (responseJSON.error.code === "MPE_USER_GROUP_MSGS/029" || responseJSON.error.code === "MPE_USER_GROUP_MSGS/032") {
									ValidFromSmartField.setValueState(sap.ui.core.ValueState.Error);
									ValidFromSmartField.setValueStateText(ErrorMSG);
								} else if (responseJSON.error.code === "MPE_USER_GROUP_MSGS/018" || responseJSON.error.code === "MPE_USER_GROUP_MSGS/019") {
									PlantSmartField.setValueState(sap.ui.core.ValueState.Error);
									PlantSmartField.setValueStateText(ErrorMSG);
								} else if (responseJSON.error.code === "MPE_USER_GROUP_MSGS/027") {
									this.getOwnerComponent().getModel().refresh(true);
									this.AddWorkCenterAssignmentDialog.close();
									sap.m.MessageToast.show(ErrorMSG);
								} else {
									sap.m.MessageToast.show(ErrorMSG);
								}
							}
							this.getOwnerComponent().getModel().refresh(true);
						}, this),
						error: jQuery.proxy(function (error) {
							this.getOwnerComponent().getModel().resetChanges();
							this.AddWorkCenterAssignmentDialog.close();
						}, this)
					});
				}
			}
		}
		}
},

onCreateWCClosePress: function () {
	this.getOwnerComponent().getModel().resetChanges();
	this.AddWorkCenterAssignmentDialog.close();
},

onClickUserWCEditButton: function (oEvent) {
	var checkSelectedItem = this.extensionAPI.getSelectedContexts("to_MfgBPWrkCtr::com.sap.vocabularies.UI.v1.LineItem::Table")[0];
	if (checkSelectedItem) {
		var sPath = checkSelectedItem.getPath();
		if (sPath) {
			if (!this.EditWCAssignmentDialog) {
				this.EditWCAssignmentDialog = sap.ui.xmlfragment("EditWCAssignmentDialog",
					"i2d.mpe.mfguser.manages1.ext.fragment.EditWorkCenterAssignment", this);
				this.getView().addDependent(this.EditWCAssignmentDialog);
				this.EditWCAssignmentDialog.setModel(this.getOwnerComponent().getModel("i18n"), "i18n");
			}
			this.EditWCAssignmentDialog.bindElement(sPath);
			sap.ui.getCore().byId(sap.ui.core.Fragment.createId("EditWCAssignmentDialog", "ValidityStartDate")).setValueState(
				sap.ui.core.ValueState.None);
			sap.ui.getCore().byId(sap.ui.core.Fragment.createId("EditWCAssignmentDialog", "ValidityEndDate")).setValueState(
				sap.ui.core.ValueState.None);
			this.EditWCAssignmentDialog.open();
		}
	} else {
		var noWCSelectedForEditing = this.getView().getModel("i18n").getResourceBundle().getText("noCertSelectedForEditing");
		sap.m.MessageToast.show(noWCSelectedForEditing);
	}
},

onEditWCOKPress: function () {
	var valueStateStartDate = sap.ui.getCore().byId(sap.ui.core.Fragment.createId("EditWCAssignmentDialog", "ValidityStartDate")).getValueState();
	var valueStateEndDate = sap.ui.getCore().byId(sap.ui.core.Fragment.createId("EditWCAssignmentDialog", "ValidityEndDate")).getValueState();
	if (valueStateStartDate === "None" && valueStateEndDate === "None") {
		var sPath = this.EditWCAssignmentDialog.getBindingContext().getPath();
		var editedWC = this.getOwnerComponent().getModel().getProperty(sPath).WorkCenter;
		var parentPath = this.getView().getBindingContext().getPath();
		var parentObject = this.getOwnerComponent().getModel().getProperty(parentPath);
		var MfgBusinessPartner = parentObject.MfgBusinessPartner;
		this.getOwnerComponent().getModel().setProperty("" + sPath + "/MfgBusinessPartner", MfgBusinessPartner);
		var pendingChanges = this.getOwnerComponent().getModel().hasPendingChanges();
		if (pendingChanges === true) {
			this.getOwnerComponent().getModel().submitChanges({
				success: jQuery.proxy(function (data) {
					this.EditWCAssignmentDialog.setBusy(false);
					var response = data.__batchResponses[data.__batchResponses.length - 1];
					var responseKeys = Object.keys(response);
					var check = false;
					for (var i in responseKeys) {
						if (responseKeys[i] === "__changeResponses") {
							check = true;
						}
					}

					if (check) {
						if (response.__changeResponses[response.__changeResponses.length - 1].statusCode === "204") {
							var WCEditSuccessMsg = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(
								"WCEditSuccessMsg", [
									editedWC
								]);
							sap.m.MessageToast.show(WCEditSuccessMsg);
							this.getOwnerComponent().getModel().refresh(true);
							this.getOwnerComponent().getModel().resetChanges();
							this.EditWCAssignmentDialog.close();
						}
					} else {
						var responseBody = data.__batchResponses[0].response.body;
						var responseJSON = JSON.parse(responseBody);
						var ErrorMSG = responseJSON.error.message.value;
						if (responseJSON.error.code === "MPE_USER_GROUP_MSGS/028" || responseJSON.error.code === "MPE_USER_GROUP_MSGS/030" ||
							responseJSON.error.code === "MPE_USER_GROUP_MSGS/031" || responseJSON.error.code === "MPE_USER_GROUP_MSGS/034") {
							var ValidToSmartField = sap.ui.getCore().byId(sap.ui.core.Fragment.createId("EditWCAssignmentDialog", "ValidityEndDate"));
							ValidToSmartField.setValueState(sap.ui.core.ValueState.Error);
							ValidToSmartField.setValueStateText(ErrorMSG);
						} else if (responseJSON.error.code === "MPE_USER_GROUP_MSGS/029" || responseJSON.error.code === "MPE_USER_GROUP_MSGS/032") {
							var ValidFromSmartField = sap.ui.getCore().byId(sap.ui.core.Fragment.createId("EditWCAssignmentDialog", "ValidityStartDate"));
							ValidFromSmartField.setValueState(sap.ui.core.ValueState.Error);
							ValidFromSmartField.setValueStateText(ErrorMSG);
						} else if (responseJSON.error.code === "MPE_USER_GROUP_MSGS/027") {
							this.getOwnerComponent().getModel().refresh(true);
							sap.m.MessageToast.show(ErrorMSG);
							this.EditWCAssignmentDialog.close();
						} else {
							sap.m.MessageToast.show(ErrorMSG);
						}

					}
					this.getOwnerComponent().getModel().refresh(true);
				}, this),

				error: jQuery.proxy(function (error) {
					this.getOwnerComponent().getModel().resetChanges();
					this.getOwnerComponent().getModel().refresh(true);
					this.EditWCAssignmentDialog.close();
				}, this)

			});
		} else

		{
			this.EditWCAssignmentDialog.close();
		}
	}
},

onEditWCClosePress: function (oEvent) {
	this.getOwnerComponent().getModel().resetChanges();
	this.EditWCAssignmentDialog.close();
},

onClickUserWCDeleteButton: function (oEvent) {
	var checkSelectedItem = this.extensionAPI.getSelectedContexts("to_MfgBPWrkCtr::com.sap.vocabularies.UI.v1.LineItem::Table")[0];
	if (checkSelectedItem) {
		var sPath = checkSelectedItem.getPath();
		this.DeletePath = sPath;
		if (sPath) {
			if (!this.DeleteWCAssignmentDialog) {
				this.DeleteWCAssignmentDialog = sap.ui.xmlfragment(
					"i2d.mpe.mfguser.manages1.ext.fragment.DeleteWorkCenterAssignment",
					this);
				this.getView().addDependent(this.DeleteWCAssignmentDialog);
				this.DeleteWCAssignmentDialog.setModel(this.getOwnerComponent().getModel("i18n"), "i18n");
			}
			this.DeleteWCAssignmentDialog.bindElement(sPath);
			this.DeleteWCAssignmentDialog.open();
		}
	} else {
		var noCertSelectedForDeleting = this.getView().getModel("i18n").getResourceBundle().getText("noWCSelectedForDeleting");
		sap.m.MessageToast.show(noCertSelectedForDeleting);
	}
},

onDeleteWCOKPress: function (oEvent) {

	this.DeleteWCAssignmentDialog.setBusy(true);
	var sPath = this.DeleteWCAssignmentDialog.getBindingContext().getPath();
	var deletedWC = this.getOwnerComponent().getModel().getProperty(sPath).WorkCenter;
	this.getOwnerComponent().getModel().remove(sPath, {
		success: jQuery.proxy(function () {
			this.DeleteWCAssignmentDialog.setBusy(false);
			this.DeleteWCAssignmentDialog.close();
			var sId = this.createId("to_MfgBPWrkCtr::com.sap.vocabularies.UI.v1.LineItem::Table");
			var oTable = this.getView().byId(sId);
			oTable.rebindTable();
			var WCDeleteSuccessMsg = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(
				"WCDeleteSuccessMsg", [
					deletedWC
				]);
			sap.m.MessageToast.show(WCDeleteSuccessMsg);
		}, this),

		error: jQuery.proxy(function (data) {

			if (data) {
				var parsedResponse = JSON.parse(data.responseText);
				// var errorCode = parsedResponse.error.code;
				var errorMsg = parsedResponse.error.message.value;
				// if (errorCode === "MPE_USER_GROUP_MSGS/027") {
				sap.m.MessageToast.show(errorMsg);
				this.DeleteWCAssignmentDialog.setBusy(false);
				this.DeleteWCAssignmentDialog.close();
				this.getOwnerComponent().getModel().resetChanges();
				// }
				// else {
				// sap.m.MessageToast.show(errorMsg);
				// // this.DeleteWCAssignmentDialog.setBusy(false);
				// }
			}

		}, this)
	});
},

onDeleteWCClosePress: function (oEvent) {
	this.DeleteWCAssignmentDialog.close();
}

});